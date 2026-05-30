package com.example.shopping.module.favorite.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.shopping.module.favorite.dto.FavoriteMsg;
import com.example.shopping.module.favorite.entity.Favorite;
import com.example.shopping.module.favorite.mapper.FavoriteMapper;
import com.example.shopping.module.favorite.service.FavoriteService;
import com.example.shopping.module.favorite.vo.FavoriteVO;
import com.example.shopping.module.goods.entity.Goods;
import com.example.shopping.module.goods.mapper.GoodsMapper;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class FavoriteServiceImpl extends ServiceImpl<FavoriteMapper, Favorite> implements FavoriteService {
    private static final String FAVORITE_TOPIC = "topic_favorite_event";
    private static final String CACHE_KEY_PREFIX = "favorite:state:";

    @Autowired
    private FavoriteMapper favoriteMapper;

    @Autowired
    private GoodsMapper goodsMapper;

    @Autowired
    private KafkaTemplate<String, FavoriteMsg> kafkaTemplate;

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    // ====================== 切换收藏/取消收藏（入口：发Kafka消息，异步削峰） ======================
    @Override
    public String toggleFavorite(Long userId, Long goodsId) {
        // 封装消息
        FavoriteMsg msg = new FavoriteMsg();
        msg.setUserId(userId);
        msg.setGoodsId(goodsId);

        // 先查Redis判断当前状态
        Boolean favorited = isFavorited(userId, goodsId);
        if (Boolean.TRUE.equals(favorited)) {
            msg.setOperateType(0); // 取消收藏
        } else {
            msg.setOperateType(1); // 收藏
        }

        // 发送Kafka，立刻返回，不阻塞
        kafkaTemplate.send(FAVORITE_TOPIC, msg);
        return "操作成功";
    }

    // ====================== Kafka消费：批量处理收藏事件 ======================
    @Override
    public void handleFavoriteMsg(List<FavoriteMsg> msgList) {
        if (CollectionUtils.isEmpty(msgList)) {
            return;
        }

        List<Favorite> addList = new ArrayList<>();
        List<Long> delIdList = new ArrayList<>();

        for (FavoriteMsg msg : msgList) {
            Long userId = msg.getUserId();
            Long goodsId = msg.getGoodsId();
            Integer type = msg.getOperateType();

            LambdaQueryWrapper<Favorite> wrapper = new LambdaQueryWrapper<>();
            wrapper.eq(Favorite::getUserId, userId)
                    .eq(Favorite::getGoodsId, goodsId);
            Favorite oldFavorite = favoriteMapper.selectOne(wrapper);

            if (type == 1) {
                // 收藏：不存在则新增
                if (oldFavorite == null) {
                    Favorite favorite = new Favorite();
                    favorite.setUserId(userId);
                    favorite.setGoodsId(goodsId);
                    favorite.setCreateTime(LocalDateTime.now());
                    favorite.setUpdateTime(LocalDateTime.now());
                    addList.add(favorite);
                    // 更新Redis
                    redisTemplate.opsForValue().set(CACHE_KEY_PREFIX + userId + ":" + goodsId, true);
                }
            } else {
                // 取消收藏：存在则删除
                if (oldFavorite != null) {
                    delIdList.add(oldFavorite.getId());
                    // 删除Redis缓存
                    redisTemplate.delete(CACHE_KEY_PREFIX + userId + ":" + goodsId);
                }
            }
        }

        // 批量新增（改用MyBatis-Plus自带的批量方法）
        if (!addList.isEmpty()) {
            this.saveBatch(addList);
        }
        // 批量删除
        if (!delIdList.isEmpty()) {
            favoriteMapper.deleteBatchIds(delIdList);
        }
    }

    // ====================== Redis缓存：判断是否已收藏 ======================
    @Override
    public Boolean isFavorited(Long userId, Long goodsId) {
        String key = CACHE_KEY_PREFIX + userId + ":" + goodsId;
        // 先查缓存
        Object cacheVal = redisTemplate.opsForValue().get(key);
        if (cacheVal != null) {
            return (Boolean) cacheVal;
        }
        // 缓存未命中，查数据库
        LambdaQueryWrapper<Favorite> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Favorite::getUserId, userId)
                .eq(Favorite::getGoodsId, goodsId);
        Favorite favorite = baseMapper.selectOne(wrapper);
        boolean result = favorite != null;
        // 写入缓存
        redisTemplate.opsForValue().set(key, result);
        return result;
    }

    // ====================== 批量查询是否被收藏（新增Redis批量缓存逻辑） ======================
    @Override
    public Map<Long, Boolean> getBatchState(Long userId, List<Long> goodsIdList) {
        Map<Long, Boolean> resultMap = new HashMap<>();
        if (CollectionUtils.isEmpty(goodsIdList)) {
            return resultMap;
        }

        // 1. 组装所有缓存Key
        List<String> cacheKeyList = goodsIdList.stream()
                .map(goodsId -> CACHE_KEY_PREFIX + userId + ":" + goodsId)
                .collect(Collectors.toList());

        // 2. Redis 批量查询
        List<Object> cacheDataList = redisTemplate.opsForValue().multiGet(cacheKeyList);

        // 3. 区分缓存命中 / 未命中数据
        List<Long> needQueryDbIds = new ArrayList<>();
        for (int i = 0; i < goodsIdList.size(); i++) {
            Long goodsId = goodsIdList.get(i);
            Object cacheVal = cacheDataList.get(i);
            if (cacheVal != null) {
                // 缓存命中，直接赋值
                resultMap.put(goodsId, (Boolean) cacheVal);
            } else {
                // 缓存缺失，标记待查库，默认未收藏
                resultMap.put(goodsId, false);
                needQueryDbIds.add(goodsId);
            }
        }

        // 4. 存在缓存缺失数据，批量查询数据库
        if (!CollectionUtils.isEmpty(needQueryDbIds)) {
            List<Long> favoritedIds = baseMapper.selectFavoritedGoodsIds(userId, needQueryDbIds);
            // 覆盖已收藏状态
            favoritedIds.forEach(id -> resultMap.put(id, true));

            // 5. 批量回写 Redis 缓存
            Map<String, Object> batchCacheMap = new HashMap<>();
            for (Long goodsId : needQueryDbIds) {
                String cacheKey = CACHE_KEY_PREFIX + userId + ":" + goodsId;
                batchCacheMap.put(cacheKey, favoritedIds.contains(goodsId));
            }
            redisTemplate.opsForValue().multiSet(batchCacheMap);
        }

        return resultMap;
    }

    // ====================== 查询用户收藏原始列表 ======================
    @Override
    public List<Favorite> getFavoriteList(Long userId) {
        LambdaQueryWrapper<Favorite> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Favorite::getUserId, userId);
        return favoriteMapper.selectList(wrapper);
    }

    // ====================== 收藏列表 + 关联商品信息 ======================
    @Override
    public List<FavoriteVO> listFavoriteWithGoods(Long userId) {
        List<Favorite> favoriteList = getFavoriteList(userId);
        if (CollectionUtils.isEmpty(favoriteList)) {
            return new ArrayList<>();
        }

        Set<Long> goodsIds = favoriteList.stream()
                .map(Favorite::getGoodsId)
                .collect(Collectors.toSet());
        List<Goods> goodsList = goodsMapper.selectBatchIds(goodsIds);

        Map<Long, Goods> goodsMap = new HashMap<>();
        for (Goods goods : goodsList) {
            goodsMap.put(goods.getId(), goods);
        }

        return favoriteList.stream().map(fav -> {
            FavoriteVO vo = new FavoriteVO();
            BeanUtils.copyProperties(fav, vo);
            Goods goods = goodsMap.get(fav.getGoodsId());
            if (goods != null) {
                vo.setGoodsName(goods.getGoodsName());
                vo.setCoverImg(goods.getCoverImg());
                vo.setPrice(goods.getPrice());
            }
            return vo;
        }).collect(Collectors.toList());
    }

    // ====================== 后台分页查询 ======================
    @Override
    public List<Favorite> backList(Integer pageNum, Integer pageSize) {
        Page<Favorite> page = new Page<>(pageNum, pageSize);
        favoriteMapper.selectPage(page, null);
        return page.getRecords();
    }

    // ====================== 根据ID删除单条收藏 ======================
    @Override
    public String deleteFavorite(Long id) {
        Favorite favorite = favoriteMapper.selectById(id);
        if (favorite == null) {
            throw new RuntimeException("收藏记录不存在");
        }
        // 删库+清缓存
        favoriteMapper.deleteById(id);
        redisTemplate.delete(CACHE_KEY_PREFIX + favorite.getUserId() + ":" + favorite.getGoodsId());
        return "取消收藏成功";
    }

    // ====================== 清空当前用户所有收藏 ======================
    @Override
    public void clearFavoriteByUserId(Long userId) {
        List<Favorite> list = getFavoriteList(userId);
        favoriteMapper.delete(new LambdaQueryWrapper<Favorite>().eq(Favorite::getUserId, userId));
        // 批量清理该用户所有收藏缓存
        for (Favorite fav : list) {
            redisTemplate.delete(CACHE_KEY_PREFIX + userId + ":" + fav.getGoodsId());
        }
    }
}
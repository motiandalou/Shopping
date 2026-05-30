package com.example.shopping.module.favorite.service;

import com.example.shopping.module.favorite.entity.Favorite;
import com.example.shopping.module.favorite.vo.FavoriteVO;
import java.util.List;
import java.util.Map;

public interface FavoriteService {

    /**
     * 切换收藏/取消收藏
     */
    String toggleFavorite(Long userId, Long goodsId);

    /**
     * 查询当前用户收藏列表（原始实体）
     */
    List<Favorite> getFavoriteList(Long userId);

    /**
     * 查询收藏列表 + 关联商品信息（前端展示）
     */
    List<FavoriteVO> listFavoriteWithGoods(Long userId);

    /**
     * 后台分页查询所有收藏
     */
    List<Favorite> backList(Integer pageNum, Integer pageSize);

    /**
     * 根据ID删除收藏
     */
    String deleteFavorite(Long id);

    /**
     * 清空当前用户所有收藏
     */
    void clearFavoriteByUserId(Long userId);

    /**
     * 消费Kafka消息，批量处理收藏事件
     */
    void handleFavoriteMsg(List<com.example.shopping.module.favorite.dto.FavoriteMsg> msgList);

    /**
     * 判断商品是否已收藏（Redis缓存）
     */
    @org.springframework.cache.annotation.Cacheable(value = "favorite", key = "'state:' + #userId + ':' + #goodsId")
    Boolean isFavorited(Long userId, Long goodsId);

    /**
     * 批量查询收藏状态
     */
    Map<Long, Boolean> getBatchState(Long userId, List<Long> goodsIdList);
}
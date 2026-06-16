package com.example.shopping.module.flash.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.example.shopping.common.page.PageDTO;
import com.example.shopping.common.page.PageRespVO;
import com.example.shopping.module.flash.dto.ActivityPageReq;
import com.example.shopping.module.flash.dto.FlashSaleGoodsVO;
import com.example.shopping.module.flash.dto.FlashSaleHomeVO;
import com.example.shopping.module.flash.entity.FlashSaleActivity;
import com.example.shopping.module.flash.entity.FlashSaleGoods;
import com.example.shopping.module.flash.mapper.FlashSaleActivityMapper;
import com.example.shopping.module.flash.mapper.FlashSaleGoodsMapper;
import com.example.shopping.module.flash.service.FlashSaleService;
import com.github.xiaoymin.knife4j.core.util.StrUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List; // 新增缺失导入

@Service
public class FlashSaleServiceImpl implements FlashSaleService {

    @Autowired
    private FlashSaleActivityMapper activityMapper;

    @Autowired
    private FlashSaleGoodsMapper flashGoodsMapper;

    // 商城首页接口
    @Override
    @Cacheable(value = "flash_sale_home", key = "'current'", sync = true)
    public FlashSaleHomeVO getHomeFlashSaleData() {
        LocalDateTime now = LocalDateTime.now();
        LambdaQueryWrapper<FlashSaleActivity> actWrapper = new LambdaQueryWrapper<>();
        actWrapper.eq(FlashSaleActivity::getStatus, 1)
                .le(FlashSaleActivity::getStartTime, now)
                .ge(FlashSaleActivity::getEndTime, now);
        FlashSaleActivity activity = activityMapper.selectOne(actWrapper);

        FlashSaleHomeVO result = new FlashSaleHomeVO();
        if (activity == null) {
            result.setRemainTotalSeconds(0L);
            result.setGoodsList(List.of());
            return result;
        }
        // 计算全场剩余秒数
        long remainSeconds = Duration.between(now, activity.getEndTime()).toSeconds();
        result.setRemainTotalSeconds(remainSeconds);
        // 查询本场所有上架秒杀商品
        List<FlashSaleGoodsVO> goodsList = flashGoodsMapper.selectFlashGoodsByActivityId(activity.getId());
        result.setGoodsList(goodsList);
        return result;
    }

    // 后台分页查询活动
    @Override
    public PageRespVO<FlashSaleActivity> pageActivity(ActivityPageReq req) {
        PageDTO pageDTO = req.getPageDTO();
        PageHelper.startPage(pageDTO.getPageNum(), pageDTO.getPageSize());
        LambdaQueryWrapper<FlashSaleActivity> wrapper = new LambdaQueryWrapper<>();
        if(StrUtil.isNotBlank(req.getActivityName())){
            wrapper.like(FlashSaleActivity::getActivityName, req.getActivityName());
        }
        if(req.getStatus() != null){
            wrapper.eq(FlashSaleActivity::getStatus, req.getStatus());
        }
        List<FlashSaleActivity> list = activityMapper.selectList(wrapper);
        PageInfo<FlashSaleActivity> pageInfo = new PageInfo<>(list);
        return PageRespVO.build(pageInfo);
    }

    // 新增活动，清空首页缓存
    @Override
    @CacheEvict(value = "flash_sale_home", allEntries = true)
    public String addActivity(FlashSaleActivity activity) {
        int insert = activityMapper.insert(activity);
        return insert > 0 ? "创建秒杀活动成功" : "创建失败";
    }

    // 更新活动，清空首页缓存
    @Override
    @CacheEvict(value = "flash_sale_home", allEntries = true)
    public String updateActivity(FlashSaleActivity activity) {
        if(activity.getId() == null){
            throw new RuntimeException("活动ID不能为空");
        }
        int update = activityMapper.updateById(activity);
        return update > 0 ? "修改活动成功" : "修改失败";
    }

    // 删除活动，同步删除绑定的秒杀商品，清空首页缓存
    @Override
    @CacheEvict(value = "flash_sale_home", allEntries = true)
    public String deleteActivity(Long id) {
        // 删除关联秒杀商品
        LambdaQueryWrapper<FlashSaleGoods> delWrapper =
                new LambdaQueryWrapper<>();
        delWrapper.eq(FlashSaleGoods::getActivityId, id);
        flashGoodsMapper.delete(delWrapper);
        // 删除活动
        int del = activityMapper.deleteById(id);
        return del > 0 ? "删除活动成功" : "删除失败";
    }

    // 给活动添加秒杀商品，清空首页缓存
    @Override
    @CacheEvict(value = "flash_sale_home", allEntries = true)
    public String addFlashGoods(FlashSaleGoods flashGoods) {
        // 校验同一活动不能重复绑定同一个商品
        LambdaQueryWrapper<FlashSaleGoods> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(FlashSaleGoods::getActivityId, flashGoods.getActivityId())
                .eq(FlashSaleGoods::getGoodsId, flashGoods.getGoodsId());
        FlashSaleGoods exist = flashGoodsMapper.selectOne(wrapper);
        if(exist != null){
            throw new RuntimeException("该商品已添加至本场秒杀，不可重复添加");
        }
        int insert = flashGoodsMapper.insert(flashGoods);
        return insert > 0 ? "添加秒杀商品成功" : "添加失败";
    }

    // 删除单个秒杀商品，清空首页缓存
    @Override
    @CacheEvict(value = "flash_sale_home", allEntries = true)
    public String deleteFlashGood(Long id) {
        int del = flashGoodsMapper.deleteById(id);
        return del > 0 ? "移除秒杀商品成功" : "移除失败";
    }
}
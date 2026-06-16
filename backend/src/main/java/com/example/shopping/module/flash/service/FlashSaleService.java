package com.example.shopping.module.flash.service;

import com.example.shopping.common.page.PageRespVO;
import com.example.shopping.module.flash.dto.ActivityPageReq;
import com.example.shopping.module.flash.dto.FlashSaleHomeVO;
import com.example.shopping.module.flash.entity.FlashSaleActivity;
import com.example.shopping.module.flash.entity.FlashSaleGoods;

public interface FlashSaleService {
    // 商城首页：获取当前进行中的秒杀数据（给前端商城首页Flash Sales）
    FlashSaleHomeVO getHomeFlashSaleData();

    // ========== 后台管理接口 ==========
    // 分页查询秒杀活动列表
    PageRespVO<FlashSaleActivity> pageActivity(ActivityPageReq req);
    // 新增秒杀活动
    String addActivity(FlashSaleActivity activity);
    // 更新活动
    String updateActivity(FlashSaleActivity activity);
    // 删除活动（连带删除绑定的秒杀商品）
    String deleteActivity(Long id);
    // 给指定活动添加秒杀商品
    String addFlashGoods(FlashSaleGoods flashGoods);
    // 删除活动内单个秒杀商品
    String deleteFlashGood(Long id);
}
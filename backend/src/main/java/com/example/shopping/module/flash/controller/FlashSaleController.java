package com.example.shopping.module.flash.controller;

import com.example.shopping.common.page.PageRespVO;
import com.example.shopping.common.result.Result;
import com.example.shopping.module.flash.dto.ActivityPageReq;
import com.example.shopping.module.flash.dto.FlashSaleHomeVO;
import com.example.shopping.module.flash.entity.FlashSaleActivity;
import com.example.shopping.module.flash.entity.FlashSaleGoods;
import com.example.shopping.module.flash.service.FlashSaleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/flash")
@RequiredArgsConstructor
@Tag(name = "秒杀模块", description = "商城首页闪购、后台秒杀活动管理接口")
public class FlashSaleController {

    private final FlashSaleService flashSaleService;

    // ========== 商城前端首页接口 ==========
    @GetMapping("/home")
    @Operation(summary = "商城首页获取闪购数据", description = "返回全场倒计时、所有正在进行的秒杀商品")
    public Result<FlashSaleHomeVO> getHomeFlashSale() {
        FlashSaleHomeVO vo = flashSaleService.getHomeFlashSaleData();
        return Result.success(vo);
    }

    // ========== 后台管理接口（Shop Admin后台调用） ==========
    // 分页查询秒杀活动列表
    @PostMapping("/activity/list")
    @Operation(summary = "后台分页查询秒杀活动")
    public Result<PageRespVO<FlashSaleActivity>> activityList(@Valid @RequestBody ActivityPageReq req){
        return Result.success(flashSaleService.pageActivity(req));
    }

    // 新增秒杀活动
    @PostMapping("/activity/add")
    @Operation(summary = "后台创建秒杀活动")
    public Result<String> addActivity(@RequestBody FlashSaleActivity activity){
        return Result.success(flashSaleService.addActivity(activity));
    }

    // 修改秒杀活动
    @PutMapping("/activity/update")
    @Operation(summary = "后台编辑秒杀活动")
    public Result<String> updateActivity(@RequestBody FlashSaleActivity activity){
        return Result.success(flashSaleService.updateActivity(activity));
    }

    // 删除秒杀活动
    @DeleteMapping("/activity/delete/{id}")
    @Operation(summary = "后台删除秒杀活动，连带删除绑定商品")
    public Result<String> deleteActivity(@PathVariable Long id){
        return Result.success(flashSaleService.deleteActivity(id));
    }

    // 给活动添加秒杀商品
    @PostMapping("/goods/add")
    @Operation(summary = "后台给指定活动绑定秒杀商品")
    public Result<String> addFlashGoods(@RequestBody FlashSaleGoods flashGoods){
        return Result.success(flashSaleService.addFlashGoods(flashGoods));
    }

    // 移除活动内单个秒杀商品
    @DeleteMapping("/goods/delete/{id}")
    @Operation(summary = "后台从活动中移除秒杀商品")
    public Result<String> deleteFlashGood(@PathVariable Long id){
        return Result.success(flashSaleService.deleteFlashGood(id));
    }
}
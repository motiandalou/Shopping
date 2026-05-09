package com.example.shopping.module.goods.controller;

import com.example.shopping.module.log.annotation.Log;
import com.example.shopping.config.Result;
import com.example.shopping.module.goods.entity.Goods;
import com.example.shopping.module.goods.service.GoodsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/goods")
@Tag(name = "商品管理", description = "商品列表、详情、新增、修改、删除接口")
public class GoodsController {

    private final GoodsService goodsService;

    // 商品管理列表
    @PostMapping("/list")
    @Operation(summary = "分页/条件查询商品列表", description = "支持根据名称、分类等条件筛选商品")
    public Result<List<Goods>> list(
            @Parameter(description = "商品查询条件", required = true) @RequestBody Goods goods) {
        return Result.success(goodsService.list(goods));
    }

    // =====================【商品详情接口】=====================
    @GetMapping("/detail/{id}")
    @Operation(summary = "获取商品详情", description = "根据商品ID查询商品详细信息")
    public Result<Goods> getGoodsDetail(
            @Parameter(description = "商品ID", required = true, example = "1001") @PathVariable Integer id) {
        Goods goods = goodsService.getDetailById(id);
        return Result.success(goods);
    }

    // 新增
    @Log(module = "商品管理", operation = "新增商品")
    @PostMapping("/add")
    @Operation(summary = "新增商品", description = "添加新商品到商城")
    public Result<String> add(
            @Parameter(description = "商品信息", required = true) @RequestBody Goods goods) {
        try {
            String msg = goodsService.add(goods);
            return Result.success(msg);
        } catch (Exception e) {
            // 失败时返回错误信息
            return Result.error(e.getMessage());
        }
    }

    // 修改
    @Log(module = "商品管理", operation = "修改商品")
    @PutMapping("/update")
    @Operation(summary = "修改商品", description = "编辑更新已有商品信息")
    public Result<String> update(
            @Parameter(description = "商品信息", required = true) @RequestBody Goods goods) {
        return Result.success(goodsService.update(goods));
    }

    // 删除
    @Log(module = "商品管理", operation = "删除商品")
    @DeleteMapping("/delete/{id}")
    @Operation(summary = "删除商品", description = "根据商品ID删除指定商品")
    public Result<String> delete(
            @Parameter(description = "商品ID", required = true, example = "1001") @PathVariable Integer id) {
        return Result.success(goodsService.delete(id));
    }
}
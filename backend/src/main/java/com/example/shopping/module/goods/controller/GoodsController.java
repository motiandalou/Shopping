package com.example.shopping.module.goods.controller;

import com.example.shopping.config.Result;
import com.example.shopping.module.goods.entity.Goods;
import com.example.shopping.module.goods.service.GoodsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/goods")
public class GoodsController {

    @Autowired
    private GoodsService goodsService;

    // 商品管理列表
    @PostMapping("/list")
    public Result<List<Goods>> list(@RequestBody Goods goods) {
        return Result.success(goodsService.list(goods));
    }

    // 新增
    @PostMapping("/add")
    public Result<String> add(@RequestBody Goods goods) {
        try {
            String msg = goodsService.add(goods);
            return Result.success(msg);
        } catch (Exception e) {
            // 失败时返回错误信息
            return Result.error(e.getMessage());
        }
    }

    // 修改
    @PutMapping("/update")
    public Result<String> update(@RequestBody Goods goods) {
        return Result.success(goodsService.update(goods));
    }

    // 删除
    @DeleteMapping("/delete/{id}")
    public Result<String> delete(@PathVariable Integer id) {
        return Result.success(goodsService.delete(id));
    }
}
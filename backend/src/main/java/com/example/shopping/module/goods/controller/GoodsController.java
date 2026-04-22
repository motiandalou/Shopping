package com.example.shopping.module.goods.controller;

import com.example.shopping.config.Result;
import com.example.shopping.module.goods.entity.Goods;
import com.example.shopping.module.goods.service.GoodsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/goods")
public class GoodsController {

    @Autowired
    private GoodsService goodsService;

    // 商品列表（前后台共用 → 必须加缓存）
    @PostMapping("/list")
    @Cacheable(value = "goodsList", key = "#goods.hashCode()") 
    public Result<List<Goods>> list(@RequestBody Goods goods) {
        return Result.success(goodsService.list(goods));
    }

    // 新增商品 → 清除缓存
    @PostMapping("/add")
    @CacheEvict(value = "goodsList", allEntries = true) 
    public Result<String> add(@RequestBody Goods goods) {
        try {
            String msg = goodsService.add(goods);
            return Result.success(msg);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    // 修改商品 → 清除缓存
    @PutMapping("/update")
    @CacheEvict(value = "goodsList", allEntries = true) 
    public Result<String> update(@RequestBody Goods goods) {
        return Result.success(goodsService.update(goods));
    }

    // 删除商品 → 清除缓存
    @DeleteMapping("/delete/{id}")
    @CacheEvict(value = "goodsList", allEntries = true) 
    public Result<String> delete(@PathVariable Integer id) {
        return Result.success(goodsService.delete(id));
    }
}
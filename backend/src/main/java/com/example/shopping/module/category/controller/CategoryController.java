package com.example.shopping.module.category.controller;

import com.example.shopping.config.Result;
import com.example.shopping.module.category.entity.Category;
import com.example.shopping.module.category.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/category")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    // 分类管理列表
    @GetMapping("/list")
    public Result<List<Category>> list() {
        return Result.success(categoryService.list(null));
    }

    // 新增
    @PostMapping("/add")
    public Result<String> add(@RequestBody Category category) {
        try {
            return Result.success();
        } catch (Exception e) {
            // 失败时返回错误信息
            return Result.error(e.getMessage());
        }
    }

    // 修改
    @PutMapping("/update")
    public Result<String> update(@RequestBody Category category) {
        return Result.success(categoryService.update(category));
    }

    // 删除
    @DeleteMapping("/delete/{id}")
    public Result<String> delete(@PathVariable Integer id) {

        return Result.success();
    }
}
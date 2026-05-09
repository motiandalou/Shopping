package com.example.shopping.module.category.controller;

import com.example.shopping.config.Result;
import com.example.shopping.module.category.entity.Category;
import com.example.shopping.module.category.service.CategoryService;
import com.example.shopping.module.log.annotation.Log;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/category")
@Tag(name = "商品分类管理", description = "商品分类查询、新增、修改、删除接口")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    // 分类管理列表
    @GetMapping("/list")
    @Operation(summary = "分页查询商品分类列表", description = "后台分页获取所有商品分类数据")
    public Result<Map<String, Object>> list(
            @Parameter(description = "页码", example = "1") @RequestParam(defaultValue = "1") Integer pageNum,
            @Parameter(description = "每页条数", example = "10") @RequestParam(defaultValue = "10") Integer pageSize
    ) {
        PageHelper.startPage(pageNum, pageSize);
        List<Category> categoryList = categoryService.list(null);
        PageInfo<Category> pageInfo = new PageInfo<>(categoryList);

        Map<String, Object> map = new HashMap<>();
        // 数据(默认前10条)
        map.put("list", pageInfo.getList());
        // 总数
        map.put("total", pageInfo.getTotal());
        return Result.success(map);
    }

    // 新增
    @Log(module = "分类管理", operation = "新增分类")
    @PostMapping("/add")
    @Operation(summary = "新增商品分类", description = "添加一级/二级商品分类")
    public Result<String> add(
            @Parameter(description = "分类信息", required = true) @RequestBody Category category) {
        try {
            return Result.success();
        } catch (Exception e) {
            // 失败时返回错误信息
            return Result.error(e.getMessage());
        }
    }

    // 修改
    @Log(module = "分类管理", operation = "修改分类")
    @PutMapping("/update")
    @Operation(summary = "修改商品分类", description = "编辑已有商品分类信息")
    public Result<String> update(
            @Parameter(description = "分类信息", required = true) @RequestBody Category category) {
        return Result.success(categoryService.update(category));
    }

    // 删除
    @Log(module = "分类管理", operation = "删除分类")
    @DeleteMapping("/delete/{id}")
    @Operation(summary = "删除商品分类", description = "根据分类ID删除指定分类")
    public Result<String> delete(
            @Parameter(description = "分类ID", required = true) @PathVariable Integer id) {
        return Result.success(categoryService.delete(id));
    }
}
package com.example.shopping.module.category.service;

import com.example.shopping.module.category.entity.Category;

import java.util.List;

public interface CategoryService {

    // 列表
    List list(Category category);

    // 新增
    String add(Category category);

    // 修改
    String update(Category category);

    // 删除
    String delete(Integer id);
}
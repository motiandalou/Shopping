package com.example.shopping.module.category.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.example.shopping.module.category.entity.Category;
import com.example.shopping.module.category.mapper.CategoryMapper;
import com.example.shopping.module.category.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.DigestUtils;

import java.util.List;

@Service
public class CategoryServiceImpl implements CategoryService {

    @Autowired
    private CategoryMapper categoryMapper;

    @Override
    public List<Category> list(Category category) {
        // 根据条件查询列表
        return categoryMapper.selectList(null);
    }

    @Override
    public String add(Category category) {
        // 1. 校验分类名称是否已存在（分类唯一标识是名称，不是用户名）
        Category existCategory = categoryMapper.selectOne(
                new LambdaQueryWrapper<Category>()
                        .eq(Category::getCategoryName, category.getCategoryName())
        );

        // 2. 如果名称已存在，抛出异常
        if (existCategory != null) {
            throw new RuntimeException("分类名称已存在");
        }

        // 3. 插入数据库
        boolean success = categoryMapper.insert(category) > 0;
        if (success) {
            return "新增成功";
        } else {
            throw new RuntimeException("新增失败");
        }
    }

    @Override
    public String update(Category category) {
        // 1. 校验分类名称是否重复（排除当前分类自己）
        Category existCategory = categoryMapper.selectOne(
                new LambdaQueryWrapper<Category>()
                        .eq(Category::getCategoryName, category.getCategoryName())
                        .ne(Category::getId, category.getId()) // 关键：排除当前ID，避免自己和自己冲突
        );

        if (existCategory != null) {
            throw new RuntimeException("分类名称已存在");
        }

        boolean success = categoryMapper.updateById(category) > 0;
        if (success) {
            return "修改成功";
        } else {
            throw new RuntimeException("修改失败");
        }
    }

    @Override
    public String delete(Integer id) {
        // 根据ID删除数据
        int rows = categoryMapper.deleteById(id);

        if (rows > 0) {
            return "删除成功";
        } else {
            throw new RuntimeException("删除失败，数据不存在");
        }
    }
}


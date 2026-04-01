package com.example.shopping.module.category.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

@Data
@TableName("t_category") // 对应数据库表名
public class Category {

    @TableId(type = IdType.AUTO)
    private Integer id;

    // 分类名称
    private String categoryName;

    // 排序
    private String level;
}
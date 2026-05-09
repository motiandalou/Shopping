package com.example.shopping.module.category.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@TableName("t_category")
@Schema(description = "商品分类实体")
public class Category {

    @TableId(type = IdType.AUTO)
    @Schema(description = "分类主键ID", example = "1", required = true)
    private Integer id;

    // 分类名称
    @Schema(description = "分类名称", example = "电子产品", required = true)
    private String categoryName;

    // 排序
    @Schema(description = "分类层级/排序值", example = "1")
    private String level;
}
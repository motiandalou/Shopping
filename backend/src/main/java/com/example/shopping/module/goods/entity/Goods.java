package com.example.shopping.module.goods.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.math.BigDecimal;

@Data
@TableName("t_goods") // 对应数据库表名
public class Goods {

    @TableId(type = IdType.AUTO)
    private Integer id;

    // 商品名称
    private String goodsName;

    // 分类ID（必须加，关联分类表用）
    private Integer categoryId;

    // 分类名称（查询时返回用）
    private String categoryName;

    // 价格
    private BigDecimal price;

    // 库存
    private Integer stock;

    // 封面图片
    private String coverImg;

    // 商品描述
    private String description;

    // 上架状态 0-未上架 1-已上架
    private Integer status;
}
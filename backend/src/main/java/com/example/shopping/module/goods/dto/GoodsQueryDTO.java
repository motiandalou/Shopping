package com.example.shopping.module.goods.dto;

import lombok.Data;

import java.util.List;

@Data
public class GoodsQueryDTO {
    // 模糊查询--商品名称
    private String goodsName;
    // 模糊查询--分类
    private List<Integer> categoryIdList;
}
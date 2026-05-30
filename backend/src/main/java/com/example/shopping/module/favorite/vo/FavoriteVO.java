package com.example.shopping.module.favorite.vo;

import lombok.Data;

@Data
public class FavoriteVO {
    private Long id;
    private Long userId;
    private Long goodsId;

    // 商品展示字段
    private String goodsName;
    private String coverImg;
    private java.math.BigDecimal price;
}
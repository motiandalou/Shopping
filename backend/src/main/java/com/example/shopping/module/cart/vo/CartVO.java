package com.example.shopping.module.cart.vo;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class CartVO {
    // 购物车自身字段
    private Long id;
    private Long userId;
    private Long goodsId;
    private Integer quantity;
    private Integer selected;
    private BigDecimal price;

    // 关联商品表后补充的字段（前端要展示的）
    private String goodsName;
    private String coverImg;
}
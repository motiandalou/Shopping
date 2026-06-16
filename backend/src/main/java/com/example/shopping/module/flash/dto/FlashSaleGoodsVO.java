package com.example.shopping.module.flash.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Schema(description = "首页闪购单商品展示VO")
public class FlashSaleGoodsVO {
    @Schema(description = "商品ID")
    private Long goodsId;
    @Schema(description = "商品名称")
    private String goodsName;
    @Schema(description = "商品封面图")
    private String coverImg;
    @Schema(description = "原价")
    private BigDecimal originPrice;
    @Schema(description = "秒杀价")
    private BigDecimal flashPrice;
    @Schema(description = "折扣百分比")
    private Integer discountRate;
    @Schema(description = "评价人数")
    private Integer reviewCount;
}
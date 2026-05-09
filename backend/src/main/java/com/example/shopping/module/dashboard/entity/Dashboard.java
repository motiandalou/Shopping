package com.example.shopping.module.dashboard.entity;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Schema(description = "后台首页数据概览统计实体")
public class Dashboard {

    @Schema(description = "总用户数", example = "1250")
    private Integer totalUser;

    @Schema(description = "总商品数", example = "368")
    private Integer totalGoods;

    @Schema(description = "总订单数", example = "9860")
    private Long totalOrder;

    @Schema(description = "总销售额", example = "286599.99")
    private BigDecimal totalSales;
}
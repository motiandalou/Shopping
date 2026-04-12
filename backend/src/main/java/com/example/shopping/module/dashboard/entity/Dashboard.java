package com.example.shopping.module.dashboard.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class Dashboard {
    // 总用户数
    private Integer totalUser;
    // 总商品数
    private Integer totalGoods;
    // 总订单数
    private Long totalOrder;
    // 总销售额
    private BigDecimal totalSales;
}




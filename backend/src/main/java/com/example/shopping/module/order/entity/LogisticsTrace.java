package com.example.shopping.module.order.entity;

import lombok.Data;

@Data
public class LogisticsTrace {
    // 物流轨迹时间
    private String AcceptTime;
    // 物流状态描述
    private String AcceptStation;
}
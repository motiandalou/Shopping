package com.example.shopping.common.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum KdniaoApiType {
    /**
     * 即时查询/在途监控（快递鸟指令 1002）
     */
    TRACK_QUERY("1002", "即时查询"),

    /**
     * 电子面单（快递鸟指令 8001）
     */
    ELECTRONIC_ORDER("8001", "电子面单");

    private final String code;
    private final String desc;
}
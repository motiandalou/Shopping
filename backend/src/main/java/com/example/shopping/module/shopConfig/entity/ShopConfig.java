package com.example.shopping.module.shopConfig.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 店铺配置实体类
 * 对应数据库表 shop_config（全局唯一店铺配置表）
 *
 * @author your name
 * @date 2025-xx-xx
 */
@Data
@TableName("shop_config")
public class ShopConfig {

    /**
     * 主键ID（自增）
     */
    @TableId(type = IdType.AUTO)
    private Long id;

    // ====================== 基础信息 ======================
    /**
     * 店铺名称
     */
    private String shopName;

    /**
     * 联系电话
     */
    private String contactPhone;

    /**
     * 店铺地址
     */
    private String shopAddress;

    /**
     * 营业时间
     */
    private String businessHours;

    /**
     * 店铺简介
     */
    private String shopIntro;

    /**
     * 包邮门槛金额（满该金额免运费）
     */
    private BigDecimal freeShippingThreshold;

    // ====================== 订单/售后配置 ======================
    /**
     * 未支付订单超时自动取消时间（单位：分钟）
     */
    private Integer unpaidTimeoutMinutes;

    /**
     * 发货后自动确认收货时间（单位：天）
     */
    private Integer autoConfirmReceiveDays;

    /**
     * 售后申请可申请天数（单位：天）
     */
    private Integer afterSaleApplyDays;

    /**
     * 是否自动同意售后
     * 0-关闭 1-开启
     */
    private Integer autoAgreeAfterSale;

    /**
     * 新订单推送通知
     * 0-关闭 1-开启
     */
    private Integer newOrderPushNotice;

    // ====================== 系统时间 ======================
    /**
     * 创建时间
     */
    private LocalDateTime createdTime;

    /**
     * 更新时间
     */
    private LocalDateTime updatedTime;
}
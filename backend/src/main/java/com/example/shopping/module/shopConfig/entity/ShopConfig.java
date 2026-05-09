package com.example.shopping.module.shopConfig.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import io.swagger.v3.oas.annotations.media.Schema;
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
@Schema(description = "店铺全局系统配置实体")
public class ShopConfig {
    @TableId(type = IdType.AUTO)
    @Schema(description = "配置ID", example = "1", required = true)
    private Long id;

    @Schema(description = "店铺名称", example = "优选商城旗舰店")
    private String shopName;

    @Schema(description = "客服联系电话", example = "13800138000")
    private String contactPhone;

    @Schema(description = "店铺地址", example = "北京市朝阳区xxx大厦")
    private String shopAddress;

    @Schema(description = "营业时间", example = "9:00-22:00")
    private String businessHours;

    @Schema(description = "店铺简介描述")
    private String shopIntro;

    @Schema(description = "包邮门槛金额", example = "99.00")
    private BigDecimal freeShippingThreshold;

    @Schema(description = "未支付订单自动取消时间(分钟)", example = "30")
    private Integer unpaidTimeoutMinutes;

    @Schema(description = "自动确认收货时间(天)", example = "7")
    private Integer autoConfirmReceiveDays;

    @Schema(description = "售后可申请天数(天)", example = "15")
    private Integer afterSaleApplyDays;

    @Schema(description = "是否自动同意售后 0-关闭 1-开启", example = "0")
    private Integer autoAgreeAfterSale;

    @Schema(description = "新订单推送通知 0-关闭 1-开启", example = "1")
    private Integer newOrderPushNotice;

    @Schema(description = "创建时间")
    private LocalDateTime createdTime;

    @Schema(description = "更新时间")
    private LocalDateTime updatedTime;
}
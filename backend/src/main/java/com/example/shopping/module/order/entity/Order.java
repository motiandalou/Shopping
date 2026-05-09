package com.example.shopping.module.order.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.extension.handlers.JacksonTypeHandler;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
// autoResultMap: 最终返回前端给json
@TableName(value = "t_order", autoResultMap = true)
// 字段为空,不返回给前端
@JsonInclude(JsonInclude.Include.NON_NULL)
@Schema(description = "订单实体")
public class Order {

    @TableId(type = IdType.AUTO)
    @Schema(description = "订单ID", example = "1001", required = true)
    private Long id;

    // 订单编号
    @Schema(description = "订单编号", example = "ORDER202505090001", required = true)
    private String orderNo;

    // 用户ID
    @Schema(description = "用户ID", example = "1001")
    private Long userId;

    // 用户名
    @TableField(value = "user_name")
    @Schema(description = "用户名", example = "张三")
    private String userName;

    // 联系电话
    @Schema(description = "联系电话", example = "13800138000")
    private String phone;

    // 收货地址
    @Schema(description = "收货地址", example = "北京市海淀区xxx路")
    private String address;

    // 商品信息
    @Schema(description = "商品信息JSON")
    private String goodsInfo;

    // 订单总金额
    @Schema(description = "订单总金额", example = "199.99")
    private BigDecimal totalAmount;

    // 订单状态：0-待支付 1-已支付 2-已发货 3-已完成 4-已取消
    @Schema(description = "订单状态 0-待支付 1-已支付 2-已发货 3-已完成 4-已取消", example = "1")
    private Integer status;

    // 创建时间
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @Schema(description = "创建时间", example = "2025-05-09 15:30:00")
    private LocalDateTime createTime;

    // 支付时间
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @Schema(description = "支付时间", example = "2025-05-09 15:35:00")
    private LocalDateTime payTime;

    // 快递公司编码（如 SF 顺丰、STO 申通）
    @Schema(description = "快递公司编码 SF-顺丰 STO-申通 YTO-圆通", example = "SF")
    private String shipperCode;

    // 快递单号
    @Schema(description = "快递运单号", example = "SF1234567890123")
    private String logisticCode;

    // 物流轨迹JSON
    @TableField(typeHandler = JacksonTypeHandler.class)
    @Schema(description = "物流轨迹信息")
    private Object logisticsTrace;

    // 退款类型 0=无 1=仅退款 2=退货退款
    @Schema(description = "退款类型 0-无 1-仅退款 2-退货退款", example = "0")
    private Integer refundType;

    // 退款状态 0=无 1=待审核 2=审核通过 3=已退款 4=已拒绝
    @Schema(description = "退款状态 0-无 1-待审核 2-审核通过 3-已退款 4-已拒绝", example = "0")
    private Integer refundStatus;

    // 退款原因
    @Schema(description = "退款原因", example = "不想要了")
    private String refundReason;

    // 退款申请时间
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @Schema(description = "退款申请时间")
    private LocalDateTime refundApplyTime;

    // 退款金额
    @Schema(description = "退款金额", example = "199.99")
    private BigDecimal refundAmount;

    // 售后工单号
    @Schema(description = "售后工单号")
    private String refundOrderNo;

}
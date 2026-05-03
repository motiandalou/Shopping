package com.example.shopping.module.order.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.extension.handlers.JacksonTypeHandler;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonFormat;


@Data
// autoResultMap: 最终返回前端给json
@TableName(value = "t_order", autoResultMap = true)
// 字段为空,不返回给前端
@JsonInclude(JsonInclude.Include.NON_NULL)

public class Order {
    @TableId(type = IdType.AUTO)
    private Long id;
    // 订单编号
    private String orderNo;
    // 用户ID
    private Long userId;
    // 用户名
    @TableField(value = "user_name")
    private String userName;
    // 联系电话
    private String phone;
    // 收货地址
    private String address;
    // 商品信息
    private String goodsInfo;
    // 订单总金额
    private BigDecimal totalAmount;
    // 订单状态：0-待支付 1-已支付 2-已发货 3-已完成 4-已取消
    private Integer status;
    // 创建时间
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private LocalDateTime createTime;
    // 支付时间
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private LocalDateTime payTime;
    // 快递公司编码（如 SF 顺丰、STO 申通）
    private String shipperCode;
    // 快递单号
    private String logisticCode;
    // 物流轨迹JSON
    @TableField(typeHandler = JacksonTypeHandler.class)
    private Object logisticsTrace;
    // 退款类型 0=无 1=仅退款 2=退货退款
    private Integer refundType;
    // 退款状态 0=无 1=待审核 2=审核通过 3=已退款 4=已拒绝
    private Integer refundStatus;
    // 退款原因
    private String refundReason;
    // 退款申请时间
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private LocalDateTime refundApplyTime;
    // 退款金额
    private BigDecimal refundAmount;
    // 售后工单号
    private String refundOrderNo;

}
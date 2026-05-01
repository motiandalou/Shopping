package com.example.shopping.module.order.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@TableName("t_order")
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
    private LocalDateTime createTime;
    // 支付时间
    private LocalDateTime payTime;
    // 物流轨迹JSON
    private String logisticsTrace;
}
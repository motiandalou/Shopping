package com.example.shopping.module.orderLog.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("t_order_log")
public class OrderLog {

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long orderId;          // 订单ID
    private String refundOrderNo;  // 售后工单号
    private String operatorName;   // 操作人
    private String operateContent; // 操作内容
    private String ipAddress;      // IP
    private LocalDateTime createTime; // 时间
}
package com.example.shopping.module.orderLog.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("t_order_log")
@Schema(description = "订单操作日志实体")
public class OrderLog {

    @TableId(type = IdType.AUTO)
    @Schema(description = "日志主键ID", example = "1", required = true)
    private Long id;

    @Schema(description = "订单ID", example = "1001")
    private Long orderId;          // 订单ID

    @Schema(description = "售后工单号", example = "REFUND20250509001")
    private String refundOrderNo;  // 售后工单号

    @Schema(description = "操作人名称", example = "管理员")
    private String operatorName;   // 操作人

    @Schema(description = "操作内容描述", example = "审核通过退款申请")
    private String operateContent; // 操作内容

    @Schema(description = "操作时间", example = "2025-05-09 16:30:00")
    private LocalDateTime createTime; // 时间
}
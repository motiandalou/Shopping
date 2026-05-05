package com.example.shopping.module.log.entity;


import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.extension.handlers.JacksonTypeHandler;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName(value = "sys_operation_log", autoResultMap = true)
public class OperationLog {
    // 日志主键ID
    private Long id;

    // 业务模块（如：用户管理 / 商品管理 / 订单管理）
    private String module;

    // 操作类型（如：新增 / 删除 / 修改 / 查询）
    private String operation;

    // 调用的方法名（后端方法）
    private String method;

    // 请求URL（接口路径）
    private String requestUrl;

    // 请求方式（GET / POST / PUT / DELETE）
    private String requestMethod;

    // 操作人ID
    private Long operatorId;

    // 操作人名称
    private String operatorName;

    // 请求参数（JSON字符串）
    @TableField(typeHandler = JacksonTypeHandler.class)
    private JsonNode requestParam;

    // 返回结果（JSON字符串）
    @TableField(typeHandler = JacksonTypeHandler.class)
    private JsonNode responseData;

    // 执行状态（0=失败，1=成功）
    private Integer status;

    // 错误信息（失败时记录）
    private String errorMsg;

    // 请求耗时（毫秒）
    private Long costTime;

    // 创建时间（日志生成时间）
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private LocalDateTime createTime;
}
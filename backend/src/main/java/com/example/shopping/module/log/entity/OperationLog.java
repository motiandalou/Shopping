package com.example.shopping.module.log.entity;


import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.extension.handlers.JacksonTypeHandler;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.JsonNode;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName(value = "sys_operation_log", autoResultMap = true)
@Schema(description = "系统操作日志实体")
public class OperationLog {

    // 日志主键ID
    @Schema(description = "日志主键ID", example = "1", required = true)
    private Long id;

    // 业务模块（如：用户管理 / 商品管理 / 订单管理）
    @Schema(description = "业务模块", example = "用户管理")
    private String module;

    // 操作类型（如：新增 / 删除 / 修改 / 查询）
    @Schema(description = "操作类型", example = "新增")
    private String operation;

    // 调用的方法名（后端方法）
    @Schema(description = "后端调用方法名")
    private String method;

    // 请求URL（接口路径）
    @Schema(description = "请求接口地址", example = "/user/list")
    private String requestUrl;

    // 请求方式（GET / POST / PUT / DELETE）
    @Schema(description = "请求方式", example = "POST")
    private String requestMethod;

    // 操作人ID
    @Schema(description = "操作人ID", example = "1001")
    private Long operatorId;

    // 操作人名称
    @Schema(description = "操作人用户名", example = "admin")
    private String operatorName;

    // 请求参数（JSON字符串）
    @TableField(typeHandler = JacksonTypeHandler.class)
    @Schema(description = "接口请求参数")
    private JsonNode requestParam;

    // 返回结果（JSON字符串）
    @TableField(typeHandler = JacksonTypeHandler.class)
    @Schema(description = "接口返回结果")
    private JsonNode responseData;

    // 执行状态（0=失败，1=成功）
    @Schema(description = "执行状态 0-失败 1-成功", example = "1")
    private Integer status;

    // 错误信息（失败时记录）
    @Schema(description = "异常错误信息")
    private String errorMsg;

    // 请求耗时（毫秒）
    @Schema(description = "接口请求耗时(毫秒)", example = "58")
    private Long costTime;

    // 创建时间（日志生成时间）
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @Schema(description = "日志创建时间", example = "2026-05-09 14:30:00")
    private LocalDateTime createTime;
}
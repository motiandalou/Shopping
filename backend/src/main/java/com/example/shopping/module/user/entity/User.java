package com.example.shopping.module.user.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalDate;

@Data
@TableName("t_user")
@Schema(description = "用户实体")
public class User {

    @TableId(type = IdType.AUTO)
    @Schema(description = "用户ID", example = "1")
    private Long id;

    @Schema(description = "用户名称", example = "张三")
    private String userName;

    @Schema(description = "密码", example = "123456")
    private String password;

    @Schema(description = "角色类型 0-普通用户 1-管理员", example = "0")
    private Integer role;

    @Schema(description = "年龄", example = "18")
    private Integer age;

    @Schema(description = "手机号码", example = "13800138000")
    private String phone;

    @Schema(description = "状态 0-禁用 1-启用", example = "1")
    private Integer status;

    @Schema(description = "用户邮箱", example = "jiangwei@example.com")
    private String email;

    @Schema(description = "用户地址", example = "Kingston, 5236, United States")
    private String address;

    @Schema(description = "生日", example = "1997-06-15")
    private LocalDate birthDate;

    @Schema(description = "性别：male/female", example = "male")
    private String gender;
}
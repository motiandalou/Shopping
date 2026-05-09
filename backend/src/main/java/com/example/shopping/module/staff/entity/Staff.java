package com.example.shopping.module.staff.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("t_staff")
@Schema(description = "后台员工/管理员实体")
public class Staff {

    @TableId(type = IdType.AUTO)
    @Schema(description = "员工ID", example = "1", required = true)
    private Long id;

    // 登录账号
    @Schema(description = "登录账号", example = "admin", required = true)
    private String userName;

    // 密码
    @Schema(description = "登录密码", example = "123456")
    private String password;

    // 真实姓名
    @Schema(description = "真实姓名", example = "张三")
    private String realName;

    // 手机号
    @Schema(description = "手机号", example = "13800138000")
    private String phone;

    // 邮箱
    @Schema(description = "邮箱地址", example = "admin@qq.com")
    private String email;

    // 角色：0-老板，1-员工
    @Schema(description = "角色 0-老板 1-员工", example = "0")
    private Integer role;

    // 状态：0-禁用，1-正常
    @Schema(description = "状态 0-禁用 1-正常", example = "1")
    private Integer status;

    // 创建时间
    @Schema(description = "创建时间", example = "2025-05-09 10:00:00")
    private LocalDateTime createTime;

    // 更新时间
    @Schema(description = "更新时间", example = "2025-05-09 11:00:00")
    private LocalDateTime updateTime;
}
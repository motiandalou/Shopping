package com.example.shopping.module.staff.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("t_staff")
public class Staff {

    @TableId(type = IdType.AUTO)
    private Long id;

    // 登录账号
    private String userName;

    // 密码
    private String password;

    // 真实姓名
    private String realName;

    // 角色：0-老板，1-员工
    private Integer role;

    // 状态：0-禁用，1-正常
    private Integer status;

    // 创建时间
    private LocalDateTime createTime;

    // 更新时间
    private LocalDateTime updateTime;
}
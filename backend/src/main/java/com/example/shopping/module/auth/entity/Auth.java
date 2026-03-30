package com.example.shopping.module.auth.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

@Data
@TableName("t_user") // 对应数据库表名
public class Auth {

    @TableId(type = IdType.AUTO)
    private Integer id;

    // 用户名（登录账号）
    private String username;

    // 密码（加密存储）
    private String password;

    // 可选字段：年龄
    private Integer age;
}
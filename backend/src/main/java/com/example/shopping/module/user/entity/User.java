package com.example.shopping.module.user.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

@Data
@TableName("t_user") // 对应数据库表名
public class User {

    @TableId(type = IdType.AUTO)
    private Long id;
    // 用户名称
    private String userName;
    // 密码
    private String password;
    // 角色类型
    private Integer role;
    // 年龄
    private Integer age;
    // 手机号码
    private String phone;
    // 状态 0-禁用 1-启用
    private Integer status;
}
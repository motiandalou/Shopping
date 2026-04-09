package com.example.shopping.module.user.service;

import com.example.shopping.module.user.entity.User;

import java.util.List;

public interface UserService {
    // 注册
    boolean register(User auth);
    // 登录
    String login(User auth);
    // 列表
    List list(User user);
    // 修改状态
    String updateStatus(Long id, Integer status);
}
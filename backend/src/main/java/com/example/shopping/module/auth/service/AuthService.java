package com.example.shopping.module.auth.service;

import com.example.shopping.module.auth.entity.Auth;

public interface AuthService {

    // 注册
    boolean register(Auth auth);

    // 登录
    String login(Auth auth);
}
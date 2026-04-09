package com.example.shopping.module.auth.controller;

import com.example.shopping.config.Result;
import com.example.shopping.module.auth.entity.Auth;
import com.example.shopping.module.auth.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    // 注册接口（统一返回Result）
    @PostMapping("/register")
    public Result<Boolean> register(@RequestBody Auth auth) {
        return Result.success(authService.register(auth));
    }

    // 登录接口（统一返回Result，修复类型不匹配）
    @PostMapping("/login")
    public Result<Map<String, String>> login(@RequestBody Auth auth) {
        try {
            String token = authService.login(auth);
            Map<String, String> data = new HashMap<>();
            data.put("token", token);
            return Result.success(data);
        } catch (RuntimeException e) {
            return Result.error(e.getMessage());
        }
    }
}
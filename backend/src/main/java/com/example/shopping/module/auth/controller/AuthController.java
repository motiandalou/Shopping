package com.example.shopping.module.auth.controller;

import com.example.shopping.module.auth.entity.Auth;
import com.example.shopping.module.auth.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    // 注册接口
    @PostMapping("/register")
    public ResponseEntity<Boolean> register(@RequestBody Auth auth) {
        return ResponseEntity.ok(authService.register(auth));
    }

    // 登录接口
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody Auth auth) {
        return ResponseEntity.ok(authService.login(auth));
    }
}
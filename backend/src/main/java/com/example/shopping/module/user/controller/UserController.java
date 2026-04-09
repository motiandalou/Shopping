package com.example.shopping.module.user.controller;

import com.example.shopping.config.Result;
import com.example.shopping.module.user.entity.User;
import com.example.shopping.module.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;

    // 注册接口
    @PostMapping("/register")
    public Result<Boolean> register(@RequestBody User user) {
        return Result.success(userService.register(user));
    }

    // 登录接口
    @PostMapping("/login")
    public Result<Map<String, String>> login(@RequestBody User user) {
        try {
            String token = userService.login(user);
            Map<String, String> data = new HashMap<>();
            data.put("token", token);
            return Result.success(data);
        } catch (RuntimeException e) {
            return Result.error(e.getMessage());
        }
    }

    // 用户管理列表
    @PostMapping("/list")
    public Result<List<User>> list(@RequestBody User user) {
        return Result.success(userService.list(user));
    }

    // 修改状态
    @PutMapping("/status/{id}")
    public Result<String> updateStatus(@PathVariable Long id, @RequestParam Integer status) {
        return Result.success(userService.updateStatus(id, status));
    }
}
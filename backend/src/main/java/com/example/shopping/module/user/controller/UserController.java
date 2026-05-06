package com.example.shopping.module.user.controller;

import com.example.shopping.config.Result;
import com.example.shopping.module.log.annotation.Log;
import com.example.shopping.module.user.entity.User;
import com.example.shopping.module.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;

    // 获取当前登录用户信息
    @GetMapping("/getCurrentUser")
    public Result<User> getCurrentUser(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        User user = userService.getById(userId);
        if (user != null) {
            user.setPassword(null);
        }
        return Result.success(user);
    }

    // 用户管理列表
    @PostMapping("/list")
    public Result<List<User>> list(@RequestBody User user) {
        return Result.success(userService.list(user));
    }

    // 修改状态
    @Log(module = "用户管理", operation = "修改用户状态")
    @PutMapping("/status/{id}")
    public Result<String> updateStatus(@PathVariable Long id, @RequestParam Integer status) {
        return Result.success(userService.updateStatus(id, status));
    }
}
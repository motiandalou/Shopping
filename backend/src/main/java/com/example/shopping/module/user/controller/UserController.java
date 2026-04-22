package com.example.shopping.module.user.controller;

import com.example.shopping.config.Result;
import com.example.shopping.module.user.entity.User;
import com.example.shopping.module.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
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

    // 注册接口 —— 无缓存
    @PostMapping("/register")
    public Result<Boolean> register(@RequestBody User user) {
        return Result.success(userService.register(user));
    }

    // 登录接口 —— 无缓存
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

    // 获取当前登录用户信息 —— 正确加缓存
    @GetMapping("/getCurrentUser")
    @Cacheable(value = "user", key = "#userId")
    public Result<User> getCurrentUser(@RequestAttribute("userId") Long userId) {
        User user = userService.getById(userId);
        if (user != null) {
            user.setPassword(null);
        }
        return Result.success(user);
    }

    // 用户管理列表 —— 加缓存，消除unchecked警告
    @PostMapping("/list")
    @Cacheable(value = "userList", key = "#user")
    public Result<List<User>> list(@RequestBody User user) {
        List<User> userList = userService.list(user);
        return Result.success(userList);
    }

    // 修改状态 —— 用@Caching包裹多个@CacheEvict
    @PutMapping("/status/{id}")
    @Caching(evict = {
            @CacheEvict(value = "user", key = "#id"),
            @CacheEvict(value = "userList", allEntries = true)
    })
    public Result<String> updateStatus(@PathVariable Long id, @RequestParam Integer status) {
        return Result.success(userService.updateStatus(id, status));
    }
}
package com.example.shopping.module.user.controller;

import com.example.shopping.config.Result;
import com.example.shopping.module.log.annotation.Log;
import com.example.shopping.module.user.entity.User;
import com.example.shopping.module.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;

@RestController
@RequestMapping("/user")
// 👇 这行就是改左边一级标题的核心
@Tag(name = "用户管理", description = "用户信息、用户列表、状态管理接口")
public class UserController {

    @Autowired
    private UserService userService;

    // 获取当前登录用户信息
    @GetMapping("/getCurrentUser")
    @Operation(summary = "获取当前登录用户信息", description = "获取当前Token对应的用户信息，密码会自动隐藏")
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
    @Operation(summary = "分页查询用户列表", description = "支持根据用户条件筛选查询")
    public Result<List<User>> list(
            @Parameter(description = "用户查询条件", required = true) @RequestBody User user
    ) {
        return Result.success(userService.list(user));
    }

    // 修改状态
    @Log(module = "用户管理", operation = "修改用户状态")
    @PutMapping("/status/{id}")
    @Operation(summary = "修改用户状态", description = "0-禁用 1-启用")
    public Result<String> updateStatus(
            @Parameter(description = "用户ID", required = true) @PathVariable Long id,
            @Parameter(description = "用户状态 0-禁用 1-启用", required = true) @RequestParam Integer status
    ) {
        return Result.success(userService.updateStatus(id, status));
    }
}
package com.example.shopping.module.user.controller;

import com.example.shopping.common.util.JwtUtil;
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

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/user")
@Tag(name = "用户管理", description = "用户信息、用户列表、状态管理接口")
public class UserController {

    @Autowired
    private UserService userService;
    @Autowired
    private JwtUtil jwtUtil;

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

    // 修改当前用户信息
    @PutMapping("/updateProfile")
    @Log(module = "用户管理", operation = "修改个人信息")
    @Operation(summary = "修改当前登录用户信息", description = "修改姓名、邮箱、地址、手机号、生日、性别等基础信息")
    public Result<String> updateProfile(
            @Parameter(description = "用户信息", required = true) @RequestBody User user,
            HttpServletRequest request
    ) {
        Long userId = (Long) request.getAttribute("userId");
        // 强制使用当前登录用户ID，防止越权
        user.setId(userId);
        return Result.success(userService.updateProfile(user));
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

    // 修改登录密码
    @Log(module = "用户管理", operation = "修改登录密码")
    @PutMapping("/updatePwd")
    @Operation(summary = "修改个人密码")
    public Result<Map<String, String>> updatePwd(@RequestBody Map<String,String> pwdMap, HttpServletRequest request){
        Long userId = (Long) request.getAttribute("userId");
        String oldPwd = pwdMap.get("oldPassword");
        String newPwd = pwdMap.get("newPassword");
        String confirmPwd = pwdMap.get("confirmPassword");

        userService.updatePwd(userId,oldPwd,newPwd,confirmPwd);
        User user = userService.getById(userId);

        String role = user.getRole() == 1 ? "ROLE_ADMIN" : "ROLE_USER";
        String accessToken = jwtUtil.generateAccessToken(user.getUserName(), role, userId);
        String refreshToken = jwtUtil.generateRefreshToken(user.getUserName(), role, userId);

        Map<String, String> tokenMap = new HashMap<>();
        tokenMap.put("accessToken", accessToken);
        tokenMap.put("refreshToken", refreshToken);
        return Result.success(tokenMap);
    }
}
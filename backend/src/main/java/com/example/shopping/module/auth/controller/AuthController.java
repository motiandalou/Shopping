package com.example.shopping.module.auth.controller;

import com.example.shopping.common.exception.BusinessException;
import com.example.shopping.common.util.JwtUtil;
import com.example.shopping.config.Result;
import com.example.shopping.module.log.annotation.Log;
import com.example.shopping.module.staff.entity.Staff;
import com.example.shopping.module.staff.service.StaffService;
import com.example.shopping.module.user.entity.User;
import com.example.shopping.module.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final JwtUtil jwtUtil;
    private final StaffService staffService;
    private final UserService userService;

    // ==================== 【后台】员工登录 ====================
    @Log(module = "员工管理", operation = "员工登录")
    @PostMapping("/staff/login")
    public Result<Map<String, String>> staffLogin(@RequestBody Staff staff) {
        try {
            // 登录校验
            staffService.login(staff);

            // 生成双 Token
            String accessToken = jwtUtil.generateAccessToken(staff.getUserName(), "ADMIN");
            String refreshToken = jwtUtil.generateRefreshToken(staff.getUserName(), "ADMIN");

            Map<String, String> map = new HashMap<>();
            map.put("accessToken", accessToken);
            map.put("refreshToken", refreshToken);
            return Result.success(map);
        } catch (RuntimeException e) {
            return Result.error(e.getMessage());
        }
    }

    // ==================== 【前台】用户登录 ====================
    @PostMapping("/user/login")
    public Result<Map<String, String>> userLogin(@RequestBody User user) {
        try {
            // 1. 调用你原来的登录（密码校验）
            userService.login(user);

            // 2. 用你正确的方法名查询用户 ✅
            User loginUser = userService.getByUserName(user.getUserName());

            Long userId = loginUser.getId();
            String role = loginUser.getRole() == 1 ? "ROLE_ADMIN" : "ROLE_USER";

            // 3. 生成双Token
            String accessToken = jwtUtil.generateAccessToken(
                    loginUser.getUserName(),
                    role,
                    userId
            );
            String refreshToken = jwtUtil.generateRefreshToken(
                    loginUser.getUserName(),
                    role,
                    userId
            );

            Map<String, String> data = new HashMap<>();
            data.put("accessToken", accessToken);
            data.put("refreshToken", refreshToken);
            return Result.success(data);
        } catch (RuntimeException e) {
            return Result.error(e.getMessage());
        }
    }

    // ==================== 【前台】用户注册 ====================
    @PostMapping("/user/register")
    public Result<Boolean> register(@RequestBody User user) {
        return Result.success(userService.register(user));
    }

    // ==================== 【后台】员工退出 ====================
    @Log(module = "员工管理", operation = "员工退出登录")
    @PostMapping("/staff/logout")
    public Result<String> staffLogout() {
        return Result.success("退出成功");
    }

    // ==================== 【前台】用户退出 ====================
    @PostMapping("/user/logout")
    public Result<String> userLogout() {
        return Result.success("退出成功");
    }

    // ==================== 双 Token 刷新 ====================
    @PostMapping("/refreshToken")
    public Result<Map<String, String>> refreshToken(@RequestParam String refreshToken) {
        try {
            String username = jwtUtil.extractUsername(refreshToken);
            String role = jwtUtil.extractRole(refreshToken);
            Long userId = jwtUtil.extractUserId(refreshToken);

            String newAccessToken;
            if (userId == null) {
                newAccessToken = jwtUtil.generateAccessToken(username, role);
            } else {
                newAccessToken = jwtUtil.generateAccessToken(username, role, userId);
            }

            Map<String, String> map = new HashMap<>();
            map.put("accessToken", newAccessToken);
            return Result.success(map);
        } catch (Exception e) {
            return Result.error("登录已过期，请重新登录");
        }
    }
}
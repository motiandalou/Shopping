package com.example.shopping.module.auth.controller;

import com.example.shopping.common.exception.BusinessException;
import com.example.shopping.common.util.JwtUtil;
import com.example.shopping.config.Result;
import com.example.shopping.module.log.annotation.Log;
import com.example.shopping.module.staff.entity.Staff;
import com.example.shopping.module.staff.service.StaffService;
import com.example.shopping.module.user.entity.User;
import com.example.shopping.module.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@Tag(name = "认证授权", description = "登录、注册、Token刷新、退出登录接口")
public class AuthController {

    private final JwtUtil jwtUtil;
    private final StaffService staffService;
    private final UserService userService;

    // ==================== 【后台】员工登录 ====================
    @Log(module = "员工管理", operation = "员工登录")
    @PostMapping("/staff/login")
    @Operation(summary = "后台员工登录", description = "员工账号密码登录，返回Token")
    public Result<Map<String, String>> staffLogin(
            @Parameter(description = "员工登录信息", required = true) @RequestBody Staff staff
    ) {
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
    @Operation(summary = "前台用户登录", description = "商城用户账号密码登录，返回Token")
    public Result<Map<String, String>> userLogin(
            @Parameter(description = "用户登录信息", required = true) @RequestBody User user
    ) {
        try {
            // 1. 调用你原来的登录（密码校验）
            userService.login(user);

            // 2. 用你正确的方法名查询用户
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
    @Operation(summary = "前台用户注册", description = "商城用户账号注册")
    public Result<Boolean> register(
            @Parameter(description = "用户注册信息", required = true) @RequestBody User user
    ) {
        return Result.success(userService.register(user));
    }

    // ==================== 【后台】员工退出 ====================
    @Log(module = "员工管理", operation = "员工退出登录")
    @PostMapping("/staff/logout")
    @Operation(summary = "后台员工退出登录", description = "员工登出，清空Token")
    public Result<String> staffLogout() {
        return Result.success("退出成功");
    }

    // ==================== 【前台】用户退出 ====================
    @PostMapping("/user/logout")
    @Operation(summary = "前台用户退出登录", description = "用户登出，清空Token")
    public Result<String> userLogout() {
        return Result.success("退出成功");
    }

    // ==================== 双 Token 刷新 ====================
    @PostMapping("/refreshToken")
    @Operation(summary = "刷新Token", description = "使用refreshToken获取新的accessToken")
    public Result<Map<String, String>> refreshToken(
            @Parameter(description = "refreshToken参数", required = true) @RequestBody Map<String, String> map
    ) {
        String refreshToken = map.get("refreshToken");

        try {
            String username = jwtUtil.extractUsername(refreshToken);
            String role = jwtUtil.extractRole(refreshToken);
            Long userId = jwtUtil.extractUserId(refreshToken);

            String newAccessToken;
            String newRefreshToken;

            // 区分有无 userId(电商网站 / 后台管理系统)
            if (userId == null) {
                newAccessToken = jwtUtil.generateAccessToken(username, role);
                newRefreshToken = jwtUtil.generateRefreshToken(username, role);
            } else {
                newAccessToken = jwtUtil.generateAccessToken(username, role, userId);
                newRefreshToken = jwtUtil.generateRefreshToken(username, role, userId);
            }

            // 经常登录的用户,一直保持登录状态
            Map<String, String> result = new HashMap<>();
            result.put("accessToken", newAccessToken);
            result.put("refreshToken", newRefreshToken);

            return Result.success(result);

        } catch (Exception e) {
            return Result.error("登录已过期，请重新登录");
        }
    }
}
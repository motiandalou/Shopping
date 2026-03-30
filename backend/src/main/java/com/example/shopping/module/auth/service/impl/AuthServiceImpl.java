package com.example.shopping.module.auth.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.example.shopping.module.auth.entity.Auth;
import com.example.shopping.module.auth.mapper.AuthMapper;
import com.example.shopping.module.auth.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.DigestUtils;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private AuthMapper authMapper;

    @Override
    public boolean register(Auth auth) {
        // 1. 检查用户名是否已存在
        Auth existUser = authMapper.selectOne(
                new LambdaQueryWrapper<Auth>()
                        .eq(Auth::getUsername, auth.getUsername())
        );
        if (existUser != null) {
            throw new RuntimeException("用户名已存在");
        }

        // 2. 密码加密（MD5 示例，生产用 BCrypt）
        String encryptedPwd = DigestUtils.md5DigestAsHex(auth.getPassword().getBytes());
        auth.setPassword(encryptedPwd);

        // 3. 插入数据库
        return authMapper.insert(auth) > 0;
    }

    @Override
    public String login(Auth auth) {
        // 1. 根据用户名查询用户
        Auth existUser = authMapper.selectOne(
                new LambdaQueryWrapper<Auth>()
                        .eq(Auth::getUsername, auth.getUsername())
        );
        if (existUser == null) {
            throw new RuntimeException("用户不存在");
        }

        // 2. 校验密码（加密后对比）
        String encryptedPwd = DigestUtils.md5DigestAsHex(auth.getPassword().getBytes());
        if (!encryptedPwd.equals(existUser.getPassword())) {
            throw new RuntimeException("密码错误");
        }

        // 3. 返回登录 Token（后续可替换为 JWT）
        return "LOGIN_SUCCESS_" + existUser.getId();
    }
}
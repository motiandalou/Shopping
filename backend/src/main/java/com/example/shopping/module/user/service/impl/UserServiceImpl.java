package com.example.shopping.module.user.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.example.shopping.common.util.JwtUtil;
import com.example.shopping.module.user.entity.User;
import com.example.shopping.module.user.mapper.UserMapper;
import com.example.shopping.module.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserMapper userMapper;

    // 注入：密码加密器
    @Autowired
    private PasswordEncoder passwordEncoder;

    // 注入：JWT工具类
    @Autowired
    private JwtUtil jwtUtil;

    /**
     * 注册
     */
    @Override
    public boolean register(User auth) {
        User existUser = userMapper.selectOne(
                new LambdaQueryWrapper<User>()
                        .eq(User::getUserName, auth.getUserName())
        );
        if (existUser != null) {
            throw new RuntimeException("用户名已存在");
        }

        // 密码加密
        String encryptedPwd = passwordEncoder.encode(auth.getPassword());
        auth.setPassword(encryptedPwd);

        // 保留原有角色设置
        auth.setRole(auth.getRole());

        return userMapper.insert(auth) > 0;
    }

    /**
     * 登录
     */
    @Override
    public String login(User auth) {
        User dbUser = userMapper.selectOne(
                new LambdaQueryWrapper<User>()
                        .eq(User::getUserName, auth.getUserName())
        );

        if (dbUser == null) {
            throw new RuntimeException("用户不存在");
        }

        // 校验密码
        if (!passwordEncoder.matches(auth.getPassword(), dbUser.getPassword())) {
            throw new RuntimeException("密码错误");
        }

        // 生成角色
        String role = dbUser.getRole() == 1 ? "ROLE_ADMIN" : "ROLE_USER";

        // 生成 JWT
        String token = jwtUtil.generateToken(
                dbUser.getUserName(),
                role,
                dbUser.getId()
        );

        return token;
    }

    /**
     * 查询用户列表（支持用户名/手机号模糊查询）
     */
    @Override
    public List<User> list(User user) {
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
        // 按用户名模糊查询
        if (user.getUserName() != null && !user.getUserName().isEmpty()) {
            wrapper.like(User::getUserName, user.getUserName());
        }
        // 按手机号模糊查询
        if (user.getPhone() != null && !user.getPhone().isEmpty()) {
            wrapper.like(User::getPhone, user.getPhone());
        }
        return userMapper.selectList(wrapper);
    }

    /**
     * 修改用户状态
     */
    @Override
    public String updateStatus(Long id, Integer status) {
        User user = userMapper.selectById(id);
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }

        User updateUser = new User();
        updateUser.setId(id);
        updateUser.setStatus(status);

        int rows = userMapper.updateById(updateUser);
        return rows > 0 ? "状态修改成功" : "状态修改失败";
    }

    @Override
    public User getById(Long id) {
        return userMapper.selectById(id);
    }
}
package com.example.shopping.module.user.service;

import com.example.shopping.module.user.entity.User;
import java.util.List;

public interface UserService {
    // 注册
    boolean register(User auth);
    // 登录（返回值改为 void）
    void login(User auth);
    // 列表
    List<User> list(User user);
    // 修改状态
    String updateStatus(Long id, Integer status);
    // 根据ID查询
    User getById(Long id);
    // 根据用户名查询
    User getByUserName(String userName);
}
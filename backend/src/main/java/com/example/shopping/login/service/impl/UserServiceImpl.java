package com.example.shopping.login.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.shopping.login.entity.User;
import com.example.shopping.login.mapper.UserMapper;
import com.example.shopping.login.service.UserService;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements UserService {

}
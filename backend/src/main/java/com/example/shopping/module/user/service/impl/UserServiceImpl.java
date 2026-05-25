package com.example.shopping.module.user.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.example.shopping.module.user.entity.User;
import com.example.shopping.module.user.mapper.UserMapper;
import com.example.shopping.module.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

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
        auth.setRole(auth.getRole());

        return userMapper.insert(auth) > 0;
    }

    /**
     * 登录（只做校验，不生成token）
     */
    @Override
    public void login(User auth) {
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
    }

    /**
     * 查询用户列表
     */
    @Override
    public List<User> list(User user) {
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
        if (user.getUserName() != null && !user.getUserName().isEmpty()) {
            wrapper.like(User::getUserName, user.getUserName());
        }
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

    /**
     * 根据ID查询
     * @param id
     * @return
     */
    @Override
    public User getById(Long id) {
        return userMapper.selectById(id);
    }

    /**
     * 根据用户名查询
     * @param userName
     * @return
     */
    @Override
    public User getByUserName(String userName) {
        return userMapper.selectOne(new LambdaQueryWrapper<User>()
                .eq(User::getUserName, userName));
    }

    /**
     * 根据生日计算年龄
     */
    public static Integer getAge(LocalDate birthDate) {
        if (birthDate == null) {
            return null;
        }
        LocalDate now = LocalDate.now();
        int age = now.getYear() - birthDate.getYear();
        if (now.getMonthValue() < birthDate.getMonthValue()
                || (now.getMonthValue() == birthDate.getMonthValue() && now.getDayOfMonth() < birthDate.getDayOfMonth())) {
            age--;
        }
        return age;
    }

    /**
     * 修改当前用户信息
     */
    @Override
    public String updateProfile(User user) {
        User dbUser = userMapper.selectById(user.getId());
        if (dbUser == null) {
            throw new RuntimeException("用户不存在");
        }

        // 只更新基础字段(密码在单独的接口)
        User updateUser = new User();
        updateUser.setId(user.getId());
        updateUser.setUserName(user.getUserName());
        updateUser.setEmail(user.getEmail());
        updateUser.setAddress(user.getAddress());
        updateUser.setPhone(user.getPhone());
        updateUser.setBirthDate(user.getBirthDate());
        updateUser.setGender(user.getGender());
        updateUser.setAge(getAge(user.getBirthDate()));

        int rows = userMapper.updateById(updateUser);
        return rows > 0 ? "个人信息修改成功" : "个人信息修改失败";
    }

    /**
     * 修改密码
     * @param userId
     * @param oldPwd
     * @param newPwd
     * @param confirmPwd
     * @return
     */
    @Override
    public String updatePwd(Long userId, String oldPwd, String newPwd, String confirmPwd) {
        // 两次新密码校验
        if(!newPwd.equals(confirmPwd)){
            throw new RuntimeException("两次输入密码不一致");
        }
        User user = userMapper.selectById(userId);
        // 校验旧密码
        if(!passwordEncoder.matches(oldPwd,user.getPassword())){
            throw new RuntimeException("原密码错误");
        }
        // 加密新密码更新
        user.setPassword(passwordEncoder.encode(newPwd));
        int rows = userMapper.updateById(user);
        return rows > 0 ? "密码修改成功" : "密码修改失败";
    }
}
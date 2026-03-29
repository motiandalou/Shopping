package com.example.shopping.login.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.example.shopping.login.entity.User;
import com.example.shopping.login.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/login")
public class UserController {

    @Autowired
    private UserService userService;

    // 1. 新增
    @PostMapping("/add")
    public boolean add(@RequestBody User user) {
        return userService.save(user);
    }

    // 2. 删除
    @DeleteMapping("/delete/{id}")
    public boolean delete(@PathVariable Long id) {
        return userService.removeById(id);
    }

    // 3. 修改
    @PutMapping("/update")
    public boolean update(@RequestBody User user) {
        return userService.updateById(user);
    }


    // 查询全部 / 根据姓名模糊查询（二合一，解决冲突）
    @GetMapping("/list")
    public List<User> list(@RequestParam(required = false) String name) {
        if (name == null || name.trim().isEmpty()) {
            return userService.list();
        }
        QueryWrapper<User> wrapper = new QueryWrapper<>();
        wrapper.like("name", name);
        return userService.list(wrapper);
    }
}

package com.example.shopping.module.staff.controller;

import com.example.shopping.config.Result;
import com.example.shopping.module.staff.entity.Staff;
import com.example.shopping.module.staff.service.StaffService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/staff")
public class StaffController {

    @Autowired
    private StaffService staffService;

    // 员工登录
    @PostMapping("/login")
    public Result<Map<String, String>> login(@RequestBody Staff staff) {
        try {
            String token = staffService.login(staff);
            Map<String, String> map = new HashMap<>();
            map.put("token", token);
            return Result.success(map);
        } catch (RuntimeException e) {
            return Result.error(e.getMessage());
        }
    }

    // 获取当前登录员工信息
    @GetMapping("/info")
    public Result<Staff> info(@RequestHeader("Authorization") String auth) {
        String token = auth.replace("Bearer ", "");
        Staff staff = staffService.getStaffInfoByToken(token);
        return Result.success(staff);
    }

    // 员工列表
    @PostMapping("/list")
    public Result<List<Staff>> list(@RequestBody Staff staff) {
        return Result.success(staffService.list(staff));
    }

    // 修改员工状态
    @PutMapping("/status/{id}")
    public Result<String> updateStatus(
            @PathVariable Long id,
            @RequestParam Integer status) {
        return Result.success(staffService.updateStatus(id, status));
    }

    // 新增员工
    @PostMapping("/add")
    public Result<Boolean> add(@RequestBody Staff staff) {
        // 校验账号是否重复
        Staff exist = staffService.getByUserName(staff.getUserName());
        if (exist != null) {
            return Result.error("登录账号已存在，请更换！");
        }
        return Result.success(staffService.save(staff));
    }

    // 修改员工
    @PostMapping("/update")
    public Result<Boolean> update(@RequestBody Staff staff) {
        return Result.success(staffService.updateById(staff));
    }

    // 删除员工
    @DeleteMapping("/delete")
    public Result<Boolean> delete(@RequestParam Long id) {
        return Result.success(staffService.removeById(id));
    }
}
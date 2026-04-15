package com.example.shopping.module.staff.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.shopping.common.util.JwtUtil;
import com.example.shopping.module.staff.entity.Staff;
import com.example.shopping.module.staff.mapper.StaffMapper;
import com.example.shopping.module.staff.service.StaffService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StaffServiceImpl extends ServiceImpl<StaffMapper, Staff> implements StaffService {

    @Autowired
    private StaffMapper staffMapper;

    @Autowired
    private JwtUtil jwtUtil;

    // 登录
    @Override
    public String login(Staff staff) {
        Staff dbStaff = staffMapper.selectByUserName(staff.getUserName());
        if (dbStaff == null) {
            throw new RuntimeException("账号不存在");
        }
        if (!dbStaff.getPassword().equals(staff.getPassword())) {
            throw new RuntimeException("密码错误");
        }
        if (dbStaff.getStatus() == 0) {
            throw new RuntimeException("账号已禁用");
        }
        return jwtUtil.generateToken(dbStaff.getUserName(), String.valueOf(dbStaff.getRole()));
    }

    // 员工列表
    @Override
    public List<Staff> list(Staff staff) {
        return staffMapper.selectList(null);
    }

    // 修改状态
    @Override
    public String updateStatus(Long id, Integer status) {
        Staff s = new Staff();
        s.setId(id);
        s.setStatus(status);
        updateById(s);
        return "状态修改成功";
    }

    // 根据 token 获取员工信息
    @Override
    public Staff getStaffInfoByToken(String token) {
        String userName = jwtUtil.extractUsername(token);
        Staff staff = staffMapper.selectByUserName(userName);
        staff.setPassword(null); // 清空密码
        return staff;
    }

    // 新增员工
    @Override
    public boolean save(Staff staff) {
        return super.save(staff);
    }

    // 修改员工
    @Override
    public boolean updateById(Staff staff) {
        return super.updateById(staff);
    }

    // 删除员工
    @Override
    public boolean removeById(Long id) {
        return super.removeById(id);
    }

    @Override
    public Staff getByUserName(String userName) {
        return staffMapper.selectOne(
                new LambdaQueryWrapper<Staff>()
                        .eq(Staff::getUserName, userName)
        );
    }
}
package com.example.shopping.module.staff.service;

import com.example.shopping.module.staff.entity.Staff;
import java.util.List;

public interface StaffService {

    // 登录
    String login(Staff auth);

    // 员工列表
    List<Staff> list(Staff staff);

    // 修改状态
    String updateStatus(Long id, Integer status);

    // 根据 token 获取当前登录员工信息
    Staff getStaffInfoByToken(String token);

    // 新增员工
    boolean save(Staff staff);

    // 新增：根据用户名查询员工（用于重复校验）
    Staff getByUserName(String userName);

    // 修改员工
    boolean updateById(Staff staff);

    // 删除员工
    boolean removeById(Long id);
}
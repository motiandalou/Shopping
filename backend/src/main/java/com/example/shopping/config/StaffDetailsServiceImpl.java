package com.example.shopping.config;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.example.shopping.module.staff.entity.Staff;
import com.example.shopping.module.staff.mapper.StaffMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class StaffDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private StaffMapper staffMapper; // 只注入员工Mapper

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // 只查询 Staff 表
        Staff staff = staffMapper.selectOne(
                new LambdaQueryWrapper<Staff>()
                        .eq(Staff::getUserName, username)
        );

        if (staff == null) {
            throw new UsernameNotFoundException("员工不存在: " + username);
        }

        // 角色配置：0=管理员/老板，1=普通员工
        String role = staff.getRole() == 0 ? "ROLE_ADMIN" : "ROLE_USER";

        // 返回给 Spring Security 认证
        return org.springframework.security.core.userdetails.User
                .withUsername(staff.getUserName())
                .password(staff.getPassword())
                .authorities(role)
                .build();
    }
}
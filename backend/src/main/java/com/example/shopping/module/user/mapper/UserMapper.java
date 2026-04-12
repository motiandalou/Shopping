package com.example.shopping.module.user.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.shopping.module.user.entity.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface UserMapper extends BaseMapper<User> {
    // 新增：统计总用户数
    @Select("SELECT COUNT(id) FROM t_user")
    int countTotalUsers();
}
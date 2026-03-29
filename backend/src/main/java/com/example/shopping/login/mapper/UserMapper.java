package com.example.shopping.login.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.shopping.login.entity.User;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserMapper extends BaseMapper<User> {

}
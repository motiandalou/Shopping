package com.example.shopping.module.dashboard.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.shopping.module.dashboard.entity.Dashboard;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface DashboardMapper extends BaseMapper<Dashboard> {

}
package com.example.shopping.module.order.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.shopping.module.order.entity.Order;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.Map;

@Mapper
public interface OrderMapper extends BaseMapper<Order> {
    // 统计总订单数 + 总销售额
    @Select("""
        SELECT
            COUNT(id) AS totalOrders,
            IFNULL(SUM(total_amount), 0) AS totalSales
        FROM t_order
        """)
    Map<String, Object> getOrderStats();
}
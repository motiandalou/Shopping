package com.example.shopping.module.dashboard.service.impl;

import com.example.shopping.module.dashboard.entity.Dashboard;
import com.example.shopping.module.dashboard.service.DashboardService;
import com.example.shopping.module.user.mapper.UserMapper;
import com.example.shopping.module.goods.mapper.GoodsMapper;
import com.example.shopping.module.order.mapper.OrderMapper;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import java.math.BigDecimal;
import java.util.Map;

@Service
public class DashboardServiceImpl implements DashboardService {

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private GoodsMapper goodsMapper;

    @Autowired
    private OrderMapper orderMapper;

    @Override
    public Dashboard getStats() {
        Dashboard dashboard = new Dashboard();

        // 1. 总用户数
        Integer totalUser = userMapper.countTotalUsers();
        dashboard.setTotalUser(totalUser);

        // 2. 总商品数
        Integer totalGoods = goodsMapper.countTotalGoods();
        dashboard.setTotalGoods(totalGoods);

        // 3. 总订单数 + 总销售额
        Map<String, Object> orderStats = orderMapper.getOrderStats();
        Long totalOrder = (Long) orderStats.get("totalOrders");
        BigDecimal totalSales = (BigDecimal) orderStats.get("totalSales");
        dashboard.setTotalOrder(totalOrder);
        dashboard.setTotalSales(totalSales);

        return dashboard;
    }
}
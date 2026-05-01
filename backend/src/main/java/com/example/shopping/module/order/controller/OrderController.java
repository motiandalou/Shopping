package com.example.shopping.module.order.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.shopping.config.Result;
import com.example.shopping.gateway.dto.GatewayMessageDTO;
import com.example.shopping.gateway.handler.GatewayMessageHandler;
import com.example.shopping.module.order.entity.Order;
import com.example.shopping.module.order.entity.LogisticsTrace;
import com.example.shopping.module.order.service.OrderService;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;
import com.example.shopping.common.util.KdniaoUtil;
import java.time.LocalDateTime;
import com.alibaba.fastjson2.JSON;
import com.alibaba.fastjson2.JSONObject;

import java.util.ArrayList;
import java.util.List;


@RestController
@RequestMapping("/order")
public class OrderController {

    @Resource
    private OrderService orderService;

    // 【后台 - 管理员】
    @GetMapping("/back/list")
    public Result<?> backList(
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize
    ) {
        Page<Order> page = orderService.backOrderList(pageNum, pageSize);
        return Result.success(page.getRecords());
    }

//    @PostMapping("/back/updateStatus")
//    public Result<?> backUpdateStatus(
//            @RequestParam Long orderId,
//            @RequestParam Integer status,
//            @RequestParam(required = false) String expressCompany,
//            @RequestParam(required = false) String expressNo
//    ) {
//        // 1. 普通状态更新
//        orderService.backUpdateStatus(orderId, status);
//
//        // 2. 如果是【发货操作】，调用快递鸟查询物流
//        // 2 = 已发货
//        if (status == 2) {
//            try {
//                // 构造快递鸟请求参数
//                String requestData = String.format(
//                        "{\"ShipperCode\":\"%s\",\"LogisticCode\":\"%s\"}",
//                        expressCompany,
//                        expressNo
//                );
//
//                // 调用快递鸟沙箱接口(TODO 正式接口的话需要修改)
//                String logisticsResult = KdniaoUtil.request(
//                        KdniaoUtil.ApiType.R8001.getCode(),
//                        requestData,
//                        // TODO true=沙箱(测试环境)，false=正式(生产环境)
//                        true
//                );
//
//                // 根据id查询订单，设置物流轨迹并更新入库
//                Order order = orderService.getById(orderId);
//                order.setLogisticsTrace(logisticsResult);
//                orderService.updateById(order);
//
//            } catch (Exception e) {
//                e.printStackTrace();
//                return Result.error("发货失败，物流接口异常");
//            }
//        }
//
//        return Result.success("发货成功");
//    }

    @PostMapping("/back/updateStatus")
    public Result<?> backUpdateStatus(
            @RequestParam Long orderId,
            @RequestParam Integer status,
            @RequestParam(required = false) String expressCompany,
            @RequestParam(required = false) String expressNo
    ) {
        orderService.backUpdateStatus(orderId, status);

        if (status == 2) {
            try {
                // 官方格式：原始JSON，不加密！！！
                String requestData = String.format(
                        "{\"ShipperCode\":\"%s\",\"LogisticCode\":\"%s\"}",
                        expressCompany,
                        expressNo
                );

                // ===================== 沙箱测试（推荐先用这个） =====================
//                String logisticsResult = KdniaoUtil.request(
//                        KdniaoUtil.ApiType.R8001.getCode(),
//                        requestData,
//                        true  // true=沙箱，false=正式
//                );
                String mockTrace = "{\n" +
                        "  \"EBusinessID\": \"1693946\",\n" +
                        "  \"ShipperCode\": \"STO\",\n" +
                        "  \"LogisticCode\": \"773367326370601\",\n" +
                        "  \"Location\": \"哈尔滨市\",\n" +
                        "  \"State\": \"2\",\n" +
                        "  \"StateEx\": \"2\",\n" +
                        "  \"Traces\": [\n" +
                        "    {\n" +
                        "      \"Action\": \"1\",\n" +
                        "      \"AcceptStation\": \"【哈尔滨市】黑龙江五常市公司(045187844033)的数据扫描账号(19845019287) 已揽收\",\n" +
                        "      \"AcceptTime\": \"2025-07-19 10:50:37\",\n" +
                        "      \"Location\": \"哈尔滨市\"\n" +
                        "    },\n" +
                        "    {\n" +
                        "      \"Action\": \"2\",\n" +
                        "      \"AcceptStation\": \"【哈尔滨市】快件已发往 黑龙江哈尔滨转运中心\",\n" +
                        "      \"AcceptTime\": \"2025-07-19 12:40:01\",\n" +
                        "      \"Location\": \"哈尔滨市\"\n" +
                        "    },\n" +
                        "    {\n" +
                        "      \"Action\": \"204\",\n" +
                        "      \"AcceptStation\": \"【哈尔滨市】快件已到达 黑龙江哈尔滨转运中心 \",\n" +
                        "      \"AcceptTime\": \"2025-07-20 01:12:11\",\n" +
                        "      \"Location\": \"哈尔滨市\"\n" +
                        "    },\n" +
                        "    {\n" +
                        "      \"Action\": \"2\",\n" +
                        "      \"AcceptStation\": \"【哈尔滨市】快件已发往 广东中山转运中心\",\n" +
                        "      \"AcceptTime\": \"2025-07-20 01:29:04\",\n" +
                        "      \"Location\": \"哈尔滨市\"\n" +
                        "    }\n" +
                        "  ],\n" +
                        "  \"Success\": true\n" +
                        "}";

                Order order = orderService.getById(orderId);
                order.setLogisticsTrace(mockTrace);
                orderService.updateById(order);

            } catch (Exception e) {
                e.printStackTrace();
                return Result.error("物流接口异常");
            }
        }

        return Result.success("操作成功");
    }

    @PostMapping("/back/delete")
    public Result<?> backDelete(@RequestParam Long orderId) {
        orderService.removeById(orderId);
        return Result.success("删除成功");
    }

    // 【前台 - 用户】
    @PostMapping("/front/add")
    public Result<?> frontAdd(@RequestBody Order order, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        String userName = (String) request.getAttribute("username");
        order.setUserId(userId);
        order.setUserName(userName);
        orderService.frontAddOrder(order);
        // 创建新订单时间
        LocalDateTime createTime = order.getCreateTime();
        // 新订单推送
        GatewayMessageDTO adminMsg = new GatewayMessageDTO( "order_all",
                "NEW_ORDER",
                "您有新订单！",
                order,
                createTime);
        GatewayMessageHandler.sendToTopic("order_all", adminMsg);
        return Result.success("下单成功");
    }

    @GetMapping("/front/my")
    public Result<Page<Order>> frontMyOrder(
            @RequestParam Long userId,
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize
    ) {
        return Result.success(orderService.frontMyOrder(userId, pageNum, pageSize));
    }

    /**
     * 获取订单物流轨迹
     */
    @GetMapping("/front/getLogistics/{orderId}")
    public Result<List<LogisticsTrace>> getLogistics(@PathVariable Long orderId) {
        Order order = orderService.getById(orderId);
        if (order == null) {
            return Result.error("订单不存在");
        }

        String traceJson = order.getLogisticsTrace();
        if (traceJson == null || traceJson.isEmpty()) {
            // 这里不报错，返回空数组
            return Result.success(new ArrayList<>());
        }

        try {
            // 直接解析整个JSON
            JSONObject jsonObject = JSON.parseObject(traceJson);

            // 直接拿 Traces 数组 → 这是最关键的一句
            List<LogisticsTrace> nodeList =
                    jsonObject.getJSONArray("Traces").toJavaList(LogisticsTrace.class);

            return Result.success(nodeList);
        } catch (Exception e) {
            e.printStackTrace();
            return Result.success(new ArrayList<>());
        }
    }

    @PostMapping("/front/delete")
    public Result<?> frontDelete(
            @RequestParam Long orderId,
            @RequestParam Long userId
    ) {
        orderService.frontDeleteOrder(orderId, userId);
        return Result.success("删除成功");
    }

    @GetMapping("/front/detail")
    public Result<Order> frontDetail(@RequestParam Long orderId) {
        return Result.success(orderService.getById(orderId));
    }
}
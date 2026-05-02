package com.example.shopping.module.order.controller;

import com.example.shopping.common.util.KdniaoUtil;
import com.example.shopping.config.Result;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/logistics")
@RequiredArgsConstructor
public class LogisticsController {

    private final KdniaoUtil kdniaoUtil;

    /**
     * 查询物流轨迹（带 Redis 缓存）
     * @param shipperCode 快递公司编码（如 SF、YTO）
     * @param logisticCode 快递单号
     * @return 统一响应结果
     */
    // TODO 生产环境
//    @GetMapping("/track/{shipperCode}/{logisticCode}")
//    public Result<JsonNode> queryLogisticsTrack(
//            @PathVariable String shipperCode,
//            @PathVariable String logisticCode) {
//
//        JsonNode trackInfo = kdniaoUtil.trackQueryWithCache(shipperCode, logisticCode);
//        if (trackInfo == null || !trackInfo.has("Traces")) {
//            return Result.error("查询失败");
//        }
//
//        // 只返回 Traces 数组，隐藏所有敏感字段
//        JsonNode traces = trackInfo.get("Traces");
//        return Result.success(traces);
//    }

    // TODO 开发环境
    @GetMapping("/track/{shipperCode}/{logisticCode}")
    public Result<JsonNode> queryLogisticsTrack(
            @PathVariable String shipperCode,
            @PathVariable String logisticCode) {

        // 假数据字符串
        String fakeJson = "{\n" +
                "  \"EBusinessID\":\"1693946\",\n" +
                "  \"ShipperCode\":\"STO\",\n" +
                "  \"LogisticCode\":\"773367326370601\",\n" +
                "  \"Location\":\"哈尔滨市\",\n" +
                "  \"State\":\"3\",\n" +
                "  \"StateEx\":\"3\",\n" +
                "  \"Success\":true,\n" +
                "  \"Traces\":[\n" +
                "    {\n" +
                "      \"Action\":\"1\",\n" +
                "      \"AcceptStation\":\"【哈尔滨市】黑龙江五常市公司 已揽收，商品已发出\",\n" +
                "      \"AcceptTime\":\"2025-07-19 10:50:37\",\n" +
                "      \"Location\":\"哈尔滨市\"\n" +
                "    },\n" +
                "    {\n" +
                "      \"Action\":\"2\",\n" +
                "      \"AcceptStation\":\"【哈尔滨市】快件已发往 哈尔滨转运中心\",\n" +
                "      \"AcceptTime\":\"2025-07-19 12:40:21\",\n" +
                "      \"Location\":\"哈尔滨市\"\n" +
                "    },\n" +
                "    {\n" +
                "      \"Action\":\"204\",\n" +
                "      \"AcceptStation\":\"【哈尔滨转运中心】快件已到达\",\n" +
                "      \"AcceptTime\":\"2025-07-19 13:15:10\",\n" +
                "      \"Location\":\"哈尔滨市\"\n" +
                "    },\n" +
                "    {\n" +
                "      \"Action\":\"2\",\n" +
                "      \"AcceptStation\":\"【哈尔滨转运中心】快件已发往 北京转运中心\",\n" +
                "      \"AcceptTime\":\"2025-07-20 01:29:04\",\n" +
                "      \"Location\":\"哈尔滨市\"\n" +
                "    },\n" +
                "    {\n" +
                "      \"Action\":\"204\",\n" +
                "      \"AcceptStation\":\"【北京转运中心】快件已到达\",\n" +
                "      \"AcceptTime\":\"2025-07-20 15:10:55\",\n" +
                "      \"Location\":\"北京市\"\n" +
                "    },\n" +
                "    {\n" +
                "      \"Action\":\"2\",\n" +
                "      \"AcceptStation\":\"【北京市】快件正在派送中\",\n" +
                "      \"AcceptTime\":\"2025-07-21 08:30:22\",\n" +
                "      \"Location\":\"北京市\"\n" +
                "    },\n" +
                "    {\n" +
                "      \"Action\":\"3\",\n" +
                "      \"AcceptStation\":\"【北京市】快件已签收，感谢使用申通快递，期待再次为您服务\",\n" +
                "      \"AcceptTime\":\"2025-07-21 17:45:16\",\n" +
                "      \"Location\":\"北京市\"\n" +
                "    }\n" +
                "  ]\n" +
                "}";;

        try {
            // 把 String 转成 JsonNode（必须这一步！）
            JsonNode root = new ObjectMapper().readTree(fakeJson);
            // ✅ 只取出 Traces 数组返回
            JsonNode traces = root.get("Traces");
            return Result.success(traces);
        } catch (Exception e) {
            return Result.error("物流信息查询失败");
        }
    }
}
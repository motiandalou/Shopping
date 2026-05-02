package com.example.shopping.common.util;

import com.example.shopping.common.enums.KdniaoApiType;
import com.example.shopping.config.KdniaoProperties;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

/**
 * 快递鸟企业级工具类
 * 支持：配置注入、日志、异常处理、Redis 缓存
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class KdniaoUtil {

    private final KdniaoProperties kdNiaoProperties;
    private final StringRedisTemplate stringRedisTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();

    private static final String CHARSET = StandardCharsets.UTF_8.name();
    private static final String DATA_TYPE = "2";
    // Redis 缓存前缀 + 过期时间（7天，物流信息一般不会频繁变动）
    private static final String REDIS_KEY_PREFIX = "kdniao:track:";
    private static final long CACHE_EXPIRE_DAYS = 7;

    // ====================== 对外核心方法（带缓存） ======================

    /**
     * 物流轨迹即时查询（带 Redis 缓存）
     * @param shipperCode 快递公司编码
     * @param logisticCode 快递单号
     * @return 物流轨迹 JSON
     */
    public JsonNode trackQueryWithCache(String shipperCode, String logisticCode) {
        // 1. 生成缓存 key
        String cacheKey = REDIS_KEY_PREFIX + shipperCode + ":" + logisticCode;

        // 2. 先查 Redis，命中直接返回
        String cachedResult = stringRedisTemplate.opsForValue().get(cacheKey);
        if (cachedResult != null) {
            log.info("物流信息命中缓存，key: {}", cacheKey);
            try {
                return objectMapper.readTree(cachedResult);
            } catch (Exception e) {
                log.error("缓存解析失败", e);
            }
        }

        // 3. 缓存未命中，调用接口查询
        String result = trackQuery(shipperCode, logisticCode);

        // 4. 查询成功，写入 Redis 缓存
        if (result != null && !result.isEmpty()) {
            stringRedisTemplate.opsForValue().set(
                    cacheKey,
                    result,
                    CACHE_EXPIRE_DAYS,
                    TimeUnit.DAYS
            );
            log.info("物流信息写入缓存，key: {}", cacheKey);
        }

        try {
            return result == null ? null : objectMapper.readTree(result);
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * 物流轨迹即时查询（原始接口，不带缓存）
     */
    public String trackQuery(String shipperCode, String logisticCode) {
        try {
            Map<String, String> param = new HashMap<>();
            param.put("ShipperCode", shipperCode);
            param.put("LogisticCode", logisticCode);
            return request(KdniaoApiType.TRACK_QUERY, param);
        } catch (Exception e) {
            log.error("物流查询异常，快递公司：{}，单号：{}", shipperCode, logisticCode, e);
            return null;
        }
    }

    /**
     * 电子面单下单
     */
    public String electronicOrder(Map<String, Object> orderData) {
        try {
            return request(KdniaoApiType.ELECTRONIC_ORDER, orderData);
        } catch (Exception e) {
            log.error("电子面单异常", e);
            return null;
        }
    }

    // ====================== 内部统一请求 ======================

    private String request(KdniaoApiType apiType, Map<String, ?> data) throws Exception {
        String requestData = objectMapper.writeValueAsString(data);

        Map<String, Object> params = new HashMap<>();
        params.put("EBusinessID", kdNiaoProperties.getBusinessId());
        params.put("RequestType", apiType.getCode());
        params.put("RequestData", URLEncoder.encode(requestData, CHARSET));
        params.put("DataSign", generateSign(requestData));
        params.put("DataType", DATA_TYPE);

        return doPost(params);
    }

    // ====================== 签名算法（官方标准） ======================
    private String generateSign(String content) throws Exception {
        String temp = content + kdNiaoProperties.getApiKey();
        String md5 = md5Lower(temp);
        return base64(md5);
    }

    private String md5Lower(String str) throws Exception {
        MessageDigest md = MessageDigest.getInstance("MD5");
        md.update(str.getBytes(CHARSET));
        byte[] bytes = md.digest();
        StringBuilder sb = new StringBuilder();
        for (byte b : bytes) {
            int val = b & 0xff;
            if (val < 16) sb.append(0);
            sb.append(Integer.toHexString(val));
        }
        return sb.toString().toLowerCase();
    }

    private String base64(String str) {
        return Base64.getEncoder().encodeToString(str.getBytes(StandardCharsets.UTF_8));
    }

    // ====================== HTTP POST ======================
    private String doPost(Map<String, Object> params) throws Exception {
        HttpURLConnection conn = null;
        OutputStreamWriter out = null;
        BufferedReader in = null;

        try {
            URL url = new URL(kdNiaoProperties.getUrl());
            conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setConnectTimeout(kdNiaoProperties.getConnectTimeout());
            conn.setReadTimeout(kdNiaoProperties.getReadTimeout());
            conn.setDoOutput(true);
            conn.setDoInput(true);
            conn.setRequestProperty("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");

            // 拼接参数
            StringBuilder paramStr = new StringBuilder();
            for (Map.Entry<String, Object> entry : params.entrySet()) {
                if (paramStr.length() > 0) paramStr.append("&");
                paramStr.append(entry.getKey()).append("=").append(entry.getValue());
            }

            out = new OutputStreamWriter(conn.getOutputStream(), StandardCharsets.UTF_8);
            out.write(paramStr.toString());
            out.flush();

            // 读取返回
            in = new BufferedReader(new InputStreamReader(conn.getInputStream(), StandardCharsets.UTF_8));
            StringBuilder result = new StringBuilder();
            String line;
            while ((line = in.readLine()) != null) {
                result.append(line);
            }
            String resp = result.toString();
            log.info("快递鸟响应: {}", resp);
            return resp;

        } finally {
            if (out != null) out.close();
            if (in != null) in.close();
            if (conn != null) conn.disconnect();
        }
    }
}
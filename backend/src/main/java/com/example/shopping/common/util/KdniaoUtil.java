package com.example.shopping.common.util;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

/**
 * 快递鸟工具类【生产环境纯净版】
 */
public class KdniaoUtil {

    private KdniaoUtil() {}

    // TODO 这是个人账号,需要真实的公司账号
    private static final String E_BUSINESS_ID = "1919821";
    private static final String API_KEY = "55a03972-8387-44b8-8f68-f4333d445e75";

    private static final String CHARSET = StandardCharsets.UTF_8.name();
    private static final String PROD_URL = "https://api.kdniao.com/api/dist";

    /**
     * 统一请求入口
     * @param requestType  接口指令 8001
     * @param requestData  请求参数JSON
     */
    public static String request(String requestType, String requestData) throws Exception {
        Map<String, Object> params = new HashMap<>(5);
        params.put("EBusinessID",   E_BUSINESS_ID);
        params.put("RequestType",   requestType);
        params.put("RequestData",   base64Encode(requestData));
        params.put("DataSign",      generateSign(requestData));
        params.put("DataType",      "2");

        return sendPost(PROD_URL, params);
    }

    // 生成签名
    private static String generateSign(String content) throws Exception {
        String md5Str = md5(content + API_KEY, CHARSET);
        return base64Encode(md5Str);
    }

    // MD5
    private static String md5(String str, String charset) throws Exception {
        MessageDigest md = MessageDigest.getInstance("MD5");
        md.update(str.getBytes(charset));
        byte[] digest = md.digest();
        StringBuilder sb = new StringBuilder(32);
        for (byte b : digest) {
            int val = b & 0xff;
            if (val <= 0xf) sb.append("0");
            sb.append(Integer.toHexString(val));
        }
        return sb.toString().toLowerCase();
    }

    // Base64
    private static String base64Encode(String str) {
        return Base64.getEncoder().encodeToString(str.getBytes(StandardCharsets.UTF_8));
    }

    // POST 请求
    private static String sendPost(String url, Map<String, Object> params) {
        HttpURLConnection conn = null;
        BufferedReader in = null;
        OutputStreamWriter out = null;
        StringBuilder result = new StringBuilder();
        try {
            URL realUrl = new URL(url);
            conn = (HttpURLConnection) realUrl.openConnection();
            conn.setRequestMethod("POST");
            conn.setDoOutput(true);
            conn.setDoInput(true);
            conn.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
            conn.setRequestProperty("accept", "*/*");
            conn.setRequestProperty("connection", "Keep-Alive");

            StringBuilder paramStr = new StringBuilder();
            for (Map.Entry<String, Object> entry : params.entrySet()) {
                if (paramStr.length() > 0) paramStr.append("&");
                paramStr.append(entry.getKey()).append("=").append(entry.getValue());
            }

            out = new OutputStreamWriter(conn.getOutputStream(), CHARSET);
            out.write(paramStr.toString());
            out.flush();

            in = new BufferedReader(new InputStreamReader(conn.getInputStream(), CHARSET));
            String line;
            while ((line = in.readLine()) != null) {
                result.append(line);
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try {
                if (out != null) out.close();
                if (in != null) in.close();
                if (conn != null) conn.disconnect();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return result.toString();
    }

    // 接口指令
    public enum ApiType {
        R8001("8001", "在途监控查询");

        private final String code;
        private final String desc;

        ApiType(String code, String desc) {
            this.code = code;
            this.desc = desc;
        }

        public String getCode() { return code; }
    }
}
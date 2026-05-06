package com.example.shopping.module.log.aspect;
import com.example.shopping.module.log.annotation.Log;

import com.alibaba.fastjson2.JSON;
import com.example.shopping.module.log.entity.OperationLog;
import com.example.shopping.module.log.service.OperationLogService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import com.example.shopping.common.util.JwtUtil;


@Aspect
@Component
@RequiredArgsConstructor
public class LogAspect {
    private final JwtUtil jwtUtil;
    private final OperationLogService logService;
    private final ObjectMapper objectMapper;

    @Around("@annotation(logAnnotation)")
    public Object around(ProceedingJoinPoint point, Log logAnnotation) throws Throwable {

        long start = System.currentTimeMillis();

        Object result = null;
        OperationLog log = new OperationLog();

        try {
            result = point.proceed();
            // 状态: 成功
            log.setStatus(1);
            try {
                // 返回结果 → 转 JsonNode
                if (result != null) {
                    JsonNode resJson = objectMapper.readTree(objectMapper.writeValueAsString(result));
                    log.setResponseData(resJson);
                }
            } catch (Exception e) {
                log.setResponseData(objectMapper.createObjectNode());
            }
        } catch (Exception e) {
            // 状态: 失败
            log.setStatus(0);
            log.setErrorMsg(e.getMessage());
            throw e;
        } finally {

            long time = System.currentTimeMillis() - start;

            HttpServletRequest request =
                    ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();

            log.setModule(logAnnotation.module());
            log.setOperation(logAnnotation.operation());

            log.setMethod(point.getSignature().toShortString());
            log.setRequestUrl(request.getRequestURI());
            log.setRequestMethod(request.getMethod());

            try {
                // 请求参数 → 转 JsonNode
                JsonNode reqJson = objectMapper.readTree(objectMapper.writeValueAsString(point.getArgs()));
                log.setRequestParam(reqJson);
            } catch (Exception e) {
                log.setRequestParam(objectMapper.createObjectNode());
            }

            log.setCostTime(time);

            // TODO 获取不到authHeader 从请求头获取 token
            String authHeader = request.getHeader("Authorization");
            String token = null;
            Long userId = 0L;
            String username = "匿名用户";

            System.out.println("authHeader: "+ authHeader);

            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                token = authHeader.substring(7);
                try {
                    username = jwtUtil.extractUsername(token);
                    userId = jwtUtil.extractUserId(token);
                } catch (Exception ignored) {
                    // 解析失败 = 无效token，保持默认值不变
                }
            }

            // 3. 赋值日志
            log.setOperatorId(userId);
            log.setOperatorName(username);

            // 4. 保存日志
            logService.save(log);
        }

        return result;
    }
}
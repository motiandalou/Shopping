package com.example.shopping.common.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * JWT工具类
 * 实现双Token机制：
 * accessToken  用于接口请求鉴权（30分钟有效期）
 * refreshToken 用于刷新accessToken（7天有效期）
 */
@Component
public class JwtUtil {

    // 密钥（长度需足够长，保证安全性）
    private static final String SECRET = "your_secure_secret_key_1234567890_abcdef";

    // AccessToken 过期时间：30分钟（接口请求令牌）
    private static final long ACCESS_EXPIRATION = 1000 * 60 * 30;

    // RefreshToken 过期时间：7天（用于刷新令牌）
    private static final long REFRESH_EXPIRATION = 1000 * 60 * 60 * 24 * 7;

    // 根据密钥生成加密Key
    private final Key key = Keys.hmacShaKeyFor(SECRET.getBytes());

    // ====================== 生成 AccessToken（后台员工：无userId） ======================
    public String generateAccessToken(String username, String role) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", role);
        return createToken(claims, username, ACCESS_EXPIRATION);
    }

    // ====================== 生成 AccessToken（前台用户：带userId） ======================
    public String generateAccessToken(String username, String role, Long userId) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", role);
        claims.put("userId", userId);
        return createToken(claims, username, ACCESS_EXPIRATION);
    }

    // ====================== 生成 RefreshToken（后台员工） ======================
    public String generateRefreshToken(String username, String role) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", role);
        return createToken(claims, username, REFRESH_EXPIRATION);
    }

    // ====================== 生成 RefreshToken（前台用户） ======================
    public String generateRefreshToken(String username, String role, Long userId) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", role);
        claims.put("userId", userId);
        return createToken(claims, username, REFRESH_EXPIRATION);
    }

    /**
     * 统一创建Token的核心方法
     * @param claims     自定义载荷（角色、用户ID等）
     * @param subject    主题（一般存用户名）
     * @param expiration 过期时间
     * @return 生成的JWT令牌
     */
    private String createToken(Map<String, Object> claims, String subject, long expiration) {
        return Jwts.builder()
                .setClaims(claims)           // 设置自定义信息
                .setSubject(subject)         // 设置主题（用户名）
                .setIssuedAt(new Date())     // 设置签发时间
                .setExpiration(new Date(System.currentTimeMillis() + expiration)) // 过期时间
                .signWith(key, SignatureAlgorithm.HS256) // 签名算法
                .compact();
    }

    // ====================== 工具方法：从Token中解析信息 ======================

    /**
     * 从token中提取用户名
     */
    public String extractUsername(String token) {
        return extractAllClaims(token).getSubject();
    }

    /**
     * 从token中提取角色：ADMIN / USER
     */
    public String extractRole(String token) {
        return (String) extractAllClaims(token).get("role");
    }

    /**
     * 从token中提取前台用户ID
     */
    public Long extractUserId(String token) {
        return extractAllClaims(token).get("userId", Long.class);
    }

    /**
     * 判断Token是否已过期
     */
    public Boolean isTokenExpired(String token) {
        return extractAllClaims(token).getExpiration().before(new Date());
    }

    /**
     * 校验Token是否有效
     * @param token    待校验token
     * @param username 用户名
     * @return 有效返回true
     */
    public Boolean validateToken(String token, String username) {
        final String extractedUsername = extractUsername(token);
        return (extractedUsername.equals(username) && !isTokenExpired(token));
    }

    /**
     * 解析Token，获取所有载荷信息
     */
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
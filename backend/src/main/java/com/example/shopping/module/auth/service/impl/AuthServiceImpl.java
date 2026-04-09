package com.example.shopping.module.auth.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.example.shopping.common.util.JwtUtil;
import com.example.shopping.module.auth.entity.Auth;
import com.example.shopping.module.auth.mapper.AuthMapper;
import com.example.shopping.module.auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService, UserDetailsService {

    private final AuthMapper authMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    /**
     * 注册
     */
    @Override
    public boolean register(Auth auth) {
        Auth existUser = authMapper.selectOne(
                new LambdaQueryWrapper<Auth>()
                        .eq(Auth::getUsername, auth.getUsername())
        );
        if (existUser != null) {
            throw new RuntimeException("用户名已存在");
        }

        String encryptedPwd = passwordEncoder.encode(auth.getPassword());
        auth.setPassword(encryptedPwd);
        auth.setRole(auth.getRole());

        return authMapper.insert(auth) > 0;
    }

    /**
     * 登录
     */
    @Override
    public String login(Auth auth) {
        System.out.println("auth: " + auth);
        // 查用户
        Auth dbUser = authMapper.selectOne(
                new LambdaQueryWrapper<Auth>()
                        .eq(Auth::getUsername, auth.getUsername())
        );

        if (dbUser == null) {
            throw new RuntimeException("用户不存在");
        }

        // 校验密码
        if (!passwordEncoder.matches(auth.getPassword(), dbUser.getPassword())) {
            throw new RuntimeException("密码错误");
        }

        // 生成角色
        String role = dbUser.getRole() == 1 ? "ROLE_ADMIN" : "ROLE_USER";

        // 生成 JWT
        String token = jwtUtil.generateToken(dbUser.getUsername(), role);

        return token;
    }

    /**
     * Spring Security 用：加载用户
     */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        LambdaQueryWrapper<Auth> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Auth::getUsername, username);
        Auth auth = authMapper.selectOne(wrapper);

        if (auth == null) {
            throw new UsernameNotFoundException("用户不存在");
        }

        List<GrantedAuthority> authorities;
        if (auth.getRole() == 1) {
            authorities = Collections.singletonList(new SimpleGrantedAuthority("ROLE_ADMIN"));
        } else {
            authorities = Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"));
        }

        return new org.springframework.security.core.userdetails.User(
                auth.getUsername(),
                auth.getPassword(),
                authorities
        );
    }
}
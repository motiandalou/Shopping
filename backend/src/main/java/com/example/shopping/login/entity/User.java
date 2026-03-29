package com.example.shopping.login.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import lombok.Data;

// 建立实体类,跟数据库表字段保持一致
@Data
public class User {
    // 主键自增（和数据库里的 AUTO_INCREMENT 对应）
    @TableId(type = IdType.AUTO)
    private Integer id;
    private String name;
    private Integer age;
}

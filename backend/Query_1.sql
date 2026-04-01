CREATE DATABASE IF NOT EXISTS shopping_db DEFAULT CHARACTER SET utf8mb4;

USE shopping_db;

# 创建用户列表
CREATE TABLE `t_user` (
                          `id` int NOT NULL AUTO_INCREMENT,
                          `username` varchar(50) NOT NULL COMMENT '用户名',
                          `password` varchar(100) NOT NULL COMMENT '密码（加密）',
                          `age` int DEFAULT NULL COMMENT '年龄',
                          PRIMARY KEY (`id`),
                          UNIQUE KEY `uk_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

# 创建分类列表
CREATE TABLE `t_category` (
                              `id` int NOT NULL AUTO_INCREMENT COMMENT '主键ID',
                              `category_name` varchar(50) NOT NULL COMMENT '分类名称',
                              `level` varchar(100) NOT NULL COMMENT '排序',
                              PRIMARY KEY (`id`),
                              UNIQUE KEY `uk_category_name` (`category_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='分类表';
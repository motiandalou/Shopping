-- 创建数据库
CREATE DATABASE IF NOT EXISTS shopping_db DEFAULT CHARACTER SET utf8mb4;

-- 使用数据库
USE shopping_db;

-- 创建用户表
CREATE TABLE `t_user` (
                          `id` int NOT NULL AUTO_INCREMENT,
                          `username` varchar(50) NOT NULL COMMENT '用户名',
                          `password` varchar(100) NOT NULL COMMENT '密码（加密）',
                          `age` int DEFAULT NULL COMMENT '年龄',
                          PRIMARY KEY (`id`),
                          UNIQUE KEY `uk_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
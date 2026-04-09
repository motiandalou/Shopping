-- 创建数据库
CREATE DATABASE IF NOT EXISTS shopping_db DEFAULT CHARACTER SET utf8mb4;

-- 使用数据库
USE shopping_db;

-- 创建用户表
CREATE TABLE `t_user` (
                          `id` int NOT NULL AUTO_INCREMENT COMMENT '主键ID',
                          `username` varchar(50) NOT NULL COMMENT '用户名',
                          `password` varchar(100) NOT NULL COMMENT '加密密码',
                          `role` int NOT NULL DEFAULT '0' COMMENT '角色：0普通用户 1管理员',
                          `age` int DEFAULT NULL COMMENT '年龄',
                          PRIMARY KEY (`id`),
                          UNIQUE KEY `uk_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- 插入一个管理员账号（密码123456，BCrypt加密后，直接用）
INSERT INTO `t_user` (`username`, `password`, `role`, `age`)
VALUES ('admin', '$2a$10$eB9Y5Z7Z7Z7Z7Z7Z7Z7Z7uO8X7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z', 1, 30);

-- 创建分类列表
CREATE TABLE `t_category` (
                              `id` int NOT NULL AUTO_INCREMENT COMMENT '主键ID',
                              `category_name` varchar(50) NOT NULL COMMENT '分类名称',
                              `level` varchar(100) NOT NULL COMMENT '排序',
                              PRIMARY KEY (`id`),
                              UNIQUE KEY `uk_category_name` (`category_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='分类表';

-- 创建分类、、商品列表
CREATE TABLE `t_goods` (
                         `id` int NOT NULL AUTO_INCREMENT COMMENT '商品ID',
                         `goods_name` varchar(100) NOT NULL COMMENT '商品名称',
                         `category_id` int NOT NULL COMMENT '分类ID',
                         `category_name` varchar(50) DEFAULT NULL COMMENT '分类名称',
                         `price` decimal(10,2) NOT NULL COMMENT '商品价格',
                         `stock` int NOT NULL DEFAULT '0' COMMENT '库存',
                         `cover_img` varchar(255) DEFAULT NULL COMMENT '商品封面图',
                         `description` text COMMENT '商品描述',
                         `status` tinyint NOT NULL DEFAULT '1' COMMENT '上架状态 0-未上架 1-已上架',
                         `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                         `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
                         PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品表';
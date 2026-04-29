# 创建数据库
CREATE DATABASE IF NOT EXISTS shopping_db DEFAULT CHARACTER SET utf8mb4;

# 使用数据库
USE shopping_db;

# 创建用户表
CREATE TABLE `t_user` (
                          `id` bigint NOT NULL AUTO_INCREMENT COMMENT '用户ID',
                          `user_name` varchar(50) NOT NULL COMMENT '用户名（登录账号）',
                          `password` varchar(100) NOT NULL COMMENT '密码（BCrypt加密）',
                          `phone` varchar(20) DEFAULT NULL COMMENT '手机号',
                          `address` varchar(255) DEFAULT NULL COMMENT '收货地址',
                          `role` tinyint NOT NULL DEFAULT '0' COMMENT '角色 0=普通用户 1=管理员',
                          `age` int DEFAULT NULL COMMENT '年龄',
                          `status` tinyint NOT NULL DEFAULT '1' COMMENT '状态 0=禁用 1=正常',
                          `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                          `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
                          PRIMARY KEY (`id`),
                          UNIQUE KEY `uk_user_name` (`user_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

# 内置超级管理员
# 账号：admin
# 密码：123456
INSERT INTO t_user (user_name, password, role, status, phone, address)
VALUES (
           'admin',
           '$2a$10$gLazgxv4VJ7nHdBDWJxSCOc2pZx1Vv4lX2nHdBDWJ7nHdBDWJ7nHd',
           2,
           1,
           '13800000000',
           '系统内置超级管理员'
       );

# 创建分类列表
CREATE TABLE `t_category` (
                              `id` int NOT NULL AUTO_INCREMENT COMMENT '主键ID',
                              `category_name` varchar(50) NOT NULL COMMENT '分类名称',
                              `level` varchar(100) NOT NULL COMMENT '排序',
                              PRIMARY KEY (`id`),
                              UNIQUE KEY `uk_category_name` (`category_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='分类表';

# 创建分类、、商品列表
CREATE TABLE `t_goods` (
                         `id` bigint NOT NULL AUTO_INCREMENT COMMENT '商品ID',
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

# 创建订单表
CREATE TABLE `t_order`
(
    `id`            BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `order_no`      VARCHAR(32)  NOT NULL COMMENT '订单编号',
    `user_id`       BIGINT       NOT NULL COMMENT '用户ID',
    `user_name`     VARCHAR(64)  NOT NULL COMMENT '用户名',
    `phone`         VARCHAR(11)  NULL COMMENT '联系电话',
    `address`       VARCHAR(255) NOT NULL COMMENT '收货地址',
    `goods_info`    TEXT         NOT NULL COMMENT '商品信息（名称+数量）',
    `total_amount`  DECIMAL(10,2) NOT NULL COMMENT '订单总金额',
    `status`        TINYINT      NOT NULL DEFAULT 0 COMMENT '订单状态：0-待支付 1-已支付 2-已发货 3-已完成 4-已取消',
    `create_time`   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `pay_time`      DATETIME     NULL COMMENT '支付时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_order_no` (`order_no`),
    KEY             `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单表';

# 创建员工表
CREATE TABLE `t_staff` (
                           `id` bigint NOT NULL AUTO_INCREMENT COMMENT '员工ID',
                           `user_name` varchar(50) NOT NULL COMMENT '登录账号',
                           `password` varchar(100) NOT NULL COMMENT '密码',
                           `real_name` varchar(50) DEFAULT NULL COMMENT '真实姓名',
                           `role` tinyint NOT NULL DEFAULT 1 COMMENT '角色 0-老板 1-员工',
                           `status` tinyint NOT NULL DEFAULT 1 COMMENT '状态 0-禁用 1-正常',
                           `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
                           `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                           PRIMARY KEY (`id`),
                           UNIQUE KEY `uk_user_name` (`user_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='店铺员工表';

-- 初始化老板账号（你用这个登录）
INSERT INTO `t_staff` (`user_name`, `password`, `real_name`, `role`)
VALUES ('admin', '123456', '店铺管理员', 0);

CREATE TABLE `t_cart` (
                          `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
                          `user_id` bigint NOT NULL COMMENT '用户ID',
                          `goods_id` bigint NOT NULL COMMENT '商品ID',
                          `quantity` int NOT NULL DEFAULT 1 COMMENT '购买数量',
                          `selected` tinyint NOT NULL DEFAULT 1 COMMENT '是否选中（1=选中，0=未选中）',
                          `price` decimal(10,2) NOT NULL COMMENT '加入购物车时的商品单价（防止后续改价影响）',
                          `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                          `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
                          PRIMARY KEY (`id`),
                          UNIQUE KEY `uk_user_goods` (`user_id`, `goods_id`) COMMENT '同一个用户同一个商品只能加一条',
                          KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='购物车表';

-- 会话表
CREATE TABLE `chat_session` (
                                `id` bigint NOT NULL AUTO_INCREMENT COMMENT '会话ID',
                                `shop_id` bigint NOT NULL COMMENT '店铺ID',
                                `user_id` bigint NOT NULL COMMENT '用户ID（买家）',
                                `unread_count` int NOT NULL DEFAULT '0' COMMENT '商家未读消息数',
                                `last_message` varchar(500) DEFAULT NULL COMMENT '最新一条消息内容',
                                `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                                `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最后更新时间',
                                PRIMARY KEY (`id`),
                                KEY `idx_shop_id` (`shop_id`),
                                KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='聊天会话表';

-- 消息表
CREATE TABLE `chat_message` (
                                `id` bigint NOT NULL AUTO_INCREMENT COMMENT '消息ID',
                                `session_id` bigint NOT NULL COMMENT '会话ID',
                                `from_user_id` bigint NOT NULL COMMENT '发送者ID（用户ID / 客服ID）',
                                `sender_type` varchar(20) NOT NULL COMMENT '发送者类型：USER-买家，SHOP_ADMIN-店铺客服',
                                `content` varchar(1000) NOT NULL COMMENT '消息内容',
                                `topic` varchar(100) DEFAULT NULL COMMENT 'WebSocket主题',
                                `is_read` tinyint NOT NULL DEFAULT '0' COMMENT '是否已读：0未读，1已读',
                                `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                                PRIMARY KEY (`id`),
                                KEY `idx_session_id` (`session_id`),
                                KEY `idx_is_read` (`is_read`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='聊天消息表';

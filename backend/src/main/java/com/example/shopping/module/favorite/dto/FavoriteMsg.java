package com.example.shopping.module.favorite.dto;

import lombok.Data;
import java.io.Serializable;

/**
 * 收藏操作 Kafka 消息体
 */
@Data
public class FavoriteMsg implements Serializable {
    private Long userId;
    private Long goodsId;
    /** 操作类型 1=收藏 0=取消收藏 */
    private Integer operateType;
}
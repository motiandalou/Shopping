package com.example.shopping.module.cart.entity;

import com.baomidou.mybatisplus.annotation.*;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@TableName("t_cart")
@Schema(description = "购物车实体")
public class Cart {

    @TableId(type = IdType.AUTO)
    @Schema(description = "购物车ID", example = "1", required = true)
    private Long id;

    @Schema(description = "用户ID", example = "1001", required = true)
    private Long userId;

    @Schema(description = "商品ID", example = "2001", required = true)
    private Long goodsId;

    @Schema(description = "购买数量", example = "1")
    private Integer quantity;

    @Schema(description = "是否选中 0-未选中 1-选中", example = "1")
    private Integer selected;

    @Schema(description = "商品单价", example = "99.99")
    private BigDecimal price;

    @TableField(fill = FieldFill.INSERT)
    @Schema(description = "创建时间")
    private LocalDateTime createTime;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;
}
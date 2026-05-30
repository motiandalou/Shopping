package com.example.shopping.module.favorite.entity;

import com.baomidou.mybatisplus.annotation.*;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("t_favorite")
@Schema(description = "商品收藏实体")
public class Favorite {

    @TableId(type = IdType.AUTO)
    @Schema(description = "收藏ID", example = "1")
    private Long id;

    @Schema(description = "用户ID", example = "1001", required = true)
    private Long userId;

    @Schema(description = "商品ID", example = "2001", required = true)
    private Long goodsId;

    @TableField(fill = FieldFill.INSERT)
    @Schema(description = "创建时间")
    private LocalDateTime createTime;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    @Schema(description = "更新时间")
    private LocalDateTime updateTime;
}
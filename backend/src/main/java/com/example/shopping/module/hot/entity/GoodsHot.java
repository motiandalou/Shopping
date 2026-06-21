package com.example.shopping.module.hot.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("goods_hot")
@Schema(description = "热销商品关联表实体")
public class GoodsHot {

    @TableId(type = IdType.AUTO)
    @Schema(description = "主键ID", example = "1", required = true)
    private Long id;

    @TableField("goods_id")
    @Schema(description = "关联商品ID", example = "10001", required = true)
    private Long goodsId;

    @TableField("sort")
    @Schema(description = "展示排序权重，数值越大前台展示越靠前", example = "5001", required = true)
    private Integer sort;

    @TableField(value = "create_time", fill = com.baomidou.mybatisplus.annotation.FieldFill.INSERT)
    @Schema(description = "记录创建时间，自动填充", example = "2026-06-21 17:31:29")
    private LocalDateTime createTime;

    // 数据库无update_time字段，暂时注释，如需使用再新增字段并开启自动填充
    // @TableField(value = "update_time", fill = com.baomidou.mybatisplus.annotation.FieldFill.INSERT_UPDATE)
    // @Schema(description = "记录更新时间，自动填充")
    // private LocalDateTime updateTime;
}
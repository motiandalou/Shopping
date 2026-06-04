package com.example.shopping.module.goods.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;

@Data
@TableName("t_goods") 
@Schema(description = "商品实体")
public class Goods implements Serializable {

    // 加一个序列化ID（固定不变）
    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.AUTO)
    @Schema(description = "商品ID", example = "1001", required = true)
    private Long id;

    // 商品名称
    @Schema(description = "商品名称", example = "iPhone 16 Pro", required = true)
    private String goodsName;

    // 分类ID（必须加，关联分类表用）
    @Schema(description = "分类ID", example = "1", required = true)
    private Integer categoryId;

    // 页码
    @Schema(description = "页码")
    @TableField(exist = false) // 数据库不存在该字段
    private Integer pageNum;

    // 每页条数
    @Schema(description = "每页条数")
    @TableField(exist = false) // 数据库不存在该字段
    private Integer pageSize;

    // 分类名称（查询时返回用）
    @Schema(description = "分类名称", example = "手机数码")
    private String categoryName;

    // 价格
    @Schema(description = "商品单价", example = "6999.00", required = true)
    private BigDecimal price;

    // 库存
    @Schema(description = "商品库存", example = "100")
    private Integer stock;

    // 预警阈值
    @Schema(description = "库存预警阈值", example = "10")
    private Integer warningNum;

    // 封面图片
    @Schema(description = "商品封面图片URL")
    private String coverImg;

    // 商品描述
    @Schema(description = "商品详细描述")
    private String description;

    // 上架状态 0-未上架 1-已上架
    @Schema(description = "上架状态 0-未上架 1-已上架", example = "1")
    private Integer status;

}
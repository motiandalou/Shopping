package com.example.shopping.module.flash.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import java.math.BigDecimal;

@Data
@TableName("flash_sale_goods")
@Schema(description = "秒杀活动绑定商品中间表")
public class FlashSaleGoods {
    @TableId(type = IdType.AUTO)
    private Long id;
    @Schema(description = "活动ID")
    private Long activityId;
    @Schema(description = "商品ID")
    private Long goodsId;
    @Schema(description = "秒杀价格")
    private BigDecimal flashPrice;
    @Schema(description = "折扣百分比，40代表-40%")
    private Integer discountRate;
    @Schema(description = "本场秒杀库存")
    private Integer flashStock;
    @Schema(description = "本场已售数量")
    private Integer soldNum;
}
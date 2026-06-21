package com.example.shopping.module.hot.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Schema(description = "首页热销商品展示VO（前台Explore板块使用）")
public class HotGoodsVO {

    @Schema(description = "热销关联记录ID", example = "1", required = true)
    private Long id;

    @Schema(description = "商品名称，商品下架/删除时可能为空", example = "华为Mate 80 Pro")
    private String goodsName;

    @Schema(description = "活动/展示售价", example = "3999.00", required = true)
    private BigDecimal flashPrice;

    @Schema(description = "商品原价", example = "4999.00", required = true)
    private BigDecimal originPrice;

    @Schema(description = "折扣比例（百分比，如85代表85折）", example = "85")
    private Integer discountRate;

    @Schema(description = "商品综合评分（满分5）", example = "4")
    private Integer rating;

    @Schema(description = "商品评价总数量", example = "1268")
    private Integer reviewCount;

    @Schema(description = "商品封面图片地址", example = "https://xxx/cover.jpg")
    private String coverImg;
}
package com.example.shopping.module.flash.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import java.util.List;

@Data
@Schema(description = "首页闪购整体返回数据")
public class FlashSaleHomeVO {
    @Schema(description = "本场活动剩余总秒数，前端做天时分秒倒计时")
    private Long remainTotalSeconds;
    @Schema(description = "闪购商品列表")
    private List<FlashSaleGoodsVO> goodsList;
}
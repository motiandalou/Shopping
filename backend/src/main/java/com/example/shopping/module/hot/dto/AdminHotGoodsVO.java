package com.example.shopping.module.hot.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Schema(description = "后台热销商品分页VO")
public class AdminHotGoodsVO {
    @Schema(description = "热销记录主键ID", example = "1", required = true)
    private Long id;

    @NotNull(message = "商品ID不能为空")
    @Schema(description = "商品主键ID", example = "1001", required = true)
    private Long goodsId;

    @Schema(description = "商品名称", example = "华为Mate 80 Pro")
    private String goodsName;

    @NotNull(message = "排序权重不能为空")
    @Schema(description = "排序权重，数字越大展示越靠前", example = "5001", required = true)
    private Integer sort;

    @Schema(description = "添加热销记录时间", example = "2026-06-21 17:31:29")
    private LocalDateTime createTime;
}
package com.example.shopping.module.flash.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("flash_sale_activity")
@Schema(description = "秒杀活动场次")
public class FlashSaleActivity {
    @TableId(type = IdType.AUTO)
    private Long id;
    @Schema(description = "活动名称")
    private String activityName;
    @Schema(description = "活动开始时间")
    private LocalDateTime startTime;
    @Schema(description = "活动结束时间")
    private LocalDateTime endTime;
    @Schema(description = "状态 0未开始 1进行中 2已结束")
    private Integer status;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}
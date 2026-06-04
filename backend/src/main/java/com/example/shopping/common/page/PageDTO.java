package com.example.shopping.common.page;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Data;

@Data
public class PageDTO {
    // 只管控分页逻辑（页码、条数、条数上限 50 拦截）

    /** 当前页码 默认1 */
    @Min(value = 1, message = "页码不能小于1")
    private int pageNum = 1;

    /** 每页条数 默认10，最大限制50防止恶意全表查询 */
    @Min(value = 1, message = "每页条数不能小于1")
    @Max(value = 50, message = "单次最多查询50条数据")
    private int pageSize = 10;
}
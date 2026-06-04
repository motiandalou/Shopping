package com.example.shopping.module.goods.dto;

import com.example.shopping.common.page.PageDTO;
import jakarta.validation.Valid;
import lombok.Data;

@Data
public class GoodsPageReq {
    @Valid
    private PageDTO pageDTO;
    private GoodsQueryDTO queryDTO;
}
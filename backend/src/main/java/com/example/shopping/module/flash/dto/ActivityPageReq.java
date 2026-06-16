package com.example.shopping.module.flash.dto;

import com.example.shopping.common.page.PageDTO;
import jakarta.validation.Valid;
import lombok.Data;

@Data
public class ActivityPageReq {
    @Valid
    private PageDTO pageDTO;
    private String activityName;
    private Integer status;
}
package com.example.shopping.module.hot.controller;

import com.example.shopping.common.result.Result;
import com.example.shopping.module.hot.dto.HotGoodsVO;
import com.example.shopping.module.hot.service.HotService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;


@RestController
@RequestMapping("/hot")
@RequiredArgsConstructor
public class HotController {
    private final HotService hotService;

    // 首页获取全部热门商品
    @GetMapping("/list")
    public Result<List<HotGoodsVO>> getHotGoods() {
        List<HotGoodsVO> list = hotService.getHomeHotGoods();
        return Result.success(list);
    }
}
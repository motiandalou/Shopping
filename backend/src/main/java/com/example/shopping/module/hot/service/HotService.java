package com.example.shopping.module.hot.service;

import com.example.shopping.common.page.PageDTO;
import com.example.shopping.common.page.PageRespVO;
import com.example.shopping.module.hot.dto.AdminHotGoodsVO;
import com.example.shopping.module.hot.dto.HotGoodsVO;
import com.example.shopping.module.hot.entity.GoodsHot;

import java.util.List;

public interface HotService {
    List<HotGoodsVO> getHomeHotGoods();

    PageRespVO<AdminHotGoodsVO> pageAdminHotGoods(PageDTO pageDTO);

    String addHot(Long goodsId, Integer sort);
    String updateHotSort(Long id, Integer sort);

    String addHot(GoodsHot goodsHot);
    String updateHotSort(GoodsHot goodsHot);

    String deleteHot(Long id);
}
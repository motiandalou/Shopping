package com.example.shopping.module.hot.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.example.shopping.common.page.PageDTO;
import com.example.shopping.common.page.PageRespVO;
import com.example.shopping.module.hot.dto.AdminHotGoodsVO;
import com.example.shopping.module.hot.dto.HotGoodsVO;
import com.example.shopping.module.hot.entity.GoodsHot;
import com.example.shopping.module.hot.mapper.GoodsHotMapper;
import com.example.shopping.module.hot.service.HotService;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class HotServiceImpl implements HotService {
    private final GoodsHotMapper goodsHotMapper;
    private static final String CACHE_KEY = "home_hot_goods";

    @Override
    @Cacheable(value = CACHE_KEY, sync = true)
    public List<HotGoodsVO> getHomeHotGoods() {
        return goodsHotMapper.selectAllHotGoods();
    }

    @Override
    public PageRespVO<AdminHotGoodsVO> pageAdminHotGoods(PageDTO pageDTO) {
        PageHelper.startPage(pageDTO.getPageNum(), pageDTO.getPageSize());
        List<AdminHotGoodsVO> dataList = goodsHotMapper.selectAdminHotGoods();
        PageInfo<AdminHotGoodsVO> pageInfo = new PageInfo<>(dataList);
        return PageRespVO.build(pageInfo);
    }

    @Override
    @CacheEvict(value = CACHE_KEY, allEntries = true)
    public String addHot(Long goodsId, Integer sort) {
        LambdaQueryWrapper<GoodsHot> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(GoodsHot::getGoodsId, goodsId);
        Long count = goodsHotMapper.selectCount(wrapper);
        if (count > 0) {
            throw new RuntimeException("该商品已添加为热门，不可重复添加");
        }

        GoodsHot hot = new GoodsHot();
        hot.setGoodsId(goodsId);
        hot.setSort(sort);

        int insert = goodsHotMapper.insert(hot);
        return insert > 0 ? "添加热门商品成功" : "添加失败";
    }

    @Override
    @CacheEvict(value = CACHE_KEY, allEntries = true)
    public String addHot(GoodsHot goodsHot) {
        return addHot(goodsHot.getGoodsId(), goodsHot.getSort());
    }

    @Override
    @CacheEvict(value = CACHE_KEY, allEntries = true)
    public String updateHotSort(Long id, Integer sort) {
        GoodsHot hot = new GoodsHot();
        hot.setId(id);
        hot.setSort(sort);

        int update = goodsHotMapper.updateById(hot);
        return update > 0 ? "修改排序成功" : "修改失败";
    }

    @Override
    @CacheEvict(value = CACHE_KEY, allEntries = true)
    public String updateHotSort(GoodsHot goodsHot) {
        return updateHotSort(goodsHot.getId(), goodsHot.getSort());
    }

    @Override
    @CacheEvict(value = CACHE_KEY, allEntries = true)
    public String deleteHot(Long id) {
        int del = goodsHotMapper.deleteById(id);
        return del > 0 ? "移除热门成功" : "移除失败";
    }
}
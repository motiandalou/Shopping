package com.example.shopping.module.goods.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.example.shopping.module.category.entity.Category;
import com.example.shopping.module.category.mapper.CategoryMapper;
import com.example.shopping.module.goods.entity.Goods;
import com.example.shopping.module.goods.mapper.GoodsMapper;
import com.example.shopping.module.goods.service.GoodsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.*;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@CacheConfig(cacheNames = "goods")
public class GoodsServiceImpl implements GoodsService {

    @Autowired
    private GoodsMapper goodsMapper;

    @Autowired
    private CategoryMapper categoryMapper;

    // ================= 查询 =================

    // 商品列表缓存
    @Override
    @Cacheable(value = "goods", key = "'list'")
    public List<Goods> list(Goods goods) {
        LambdaQueryWrapper<Goods> wrapper = new LambdaQueryWrapper<>();

        if (goods.getGoodsName() != null && !goods.getGoodsName().isEmpty()) {
            wrapper.like(Goods::getGoodsName, goods.getGoodsName());
        }
        if (goods.getCategoryId() != null) {
            wrapper.eq(Goods::getCategoryId, goods.getCategoryId());
        }

        List<Goods> goodsList = goodsMapper.selectList(wrapper);

        // ✅ 分类缓存（走缓存方法）
        List<Category> categoryList = getAllCategory();

        Map<Integer, String> categoryMap = categoryList.stream()
                .collect(Collectors.toMap(Category::getId, Category::getCategoryName));

        goodsList.forEach(goodsItem -> {
            Integer cid = goodsItem.getCategoryId();
            if (cid != null) {
                goodsItem.setCategoryName(categoryMap.get(cid));
            }
        });

        return goodsList;
    }

    // 商品详情缓存
    @Override
    @Cacheable(value = "goods", key = "'detail:' + #id")
    public Goods getDetailById(Integer id) {
        Goods goods = goodsMapper.selectById(id);

        if (goods != null && goods.getCategoryId() != null) {
            Category category = categoryMapper.selectById(goods.getCategoryId());
            if (category != null) {
                goods.setCategoryName(category.getCategoryName());
            }
        }
        return goods;
    }

    // ================= 分类缓存 =================
    @Cacheable(cacheNames = "category", key = "'all'", unless = "#result == null || #result.isEmpty()")
    public List<Category> getAllCategory() {
        return categoryMapper.selectList(null);
    }

    // ================= 写操作（清缓存） =================

    @Override
    @CacheEvict(cacheNames = "goods", allEntries = true)
    public String add(Goods goods) {
        Goods exist = goodsMapper.selectOne(
                new LambdaQueryWrapper<Goods>()
                        .eq(Goods::getGoodsName, goods.getGoodsName())
        );

        if (exist != null) {
            throw new RuntimeException("商品名称已存在");
        }

        int rows = goodsMapper.insert(goods);
        return rows > 0 ? "新增成功" : "新增失败";
    }

    @Override
    @CacheEvict(cacheNames = "goods", allEntries = true)
    public String update(Goods goods) {

        if (goods.getId() == null) {
            throw new RuntimeException("商品ID不能为空");
        }

        Goods exist = goodsMapper.selectOne(
                new LambdaQueryWrapper<Goods>()
                        .eq(Goods::getGoodsName, goods.getGoodsName())
                        .ne(Goods::getId, goods.getId())
        );

        if (exist != null) {
            throw new RuntimeException("商品名称已存在");
        }

        int rows = goodsMapper.updateById(goods);
        return rows > 0 ? "修改成功" : "修改失败";
    }

    @Override
    @CacheEvict(cacheNames = "goods", allEntries = true)
    public String delete(Integer id) {
        int rows = goodsMapper.deleteById(id);

        if (rows > 0) {
            return "删除成功";
        } else {
            throw new RuntimeException("删除失败，数据不存在");
        }
    }
}
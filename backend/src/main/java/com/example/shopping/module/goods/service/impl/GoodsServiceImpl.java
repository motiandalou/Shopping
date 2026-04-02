package com.example.shopping.module.goods.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.example.shopping.module.category.entity.Category;
import com.example.shopping.module.category.mapper.CategoryMapper;
import com.example.shopping.module.goods.entity.Goods;
import com.example.shopping.module.goods.mapper.GoodsMapper;
import com.example.shopping.module.goods.service.GoodsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class GoodsServiceImpl implements GoodsService {

    @Autowired
    private GoodsMapper goodsMapper;

    @Autowired
    private CategoryMapper categoryMapper;

    // 查询列表
    @Override
    public List<Goods> list(Goods goods) {
        LambdaQueryWrapper<Goods> wrapper = new LambdaQueryWrapper<>();

        if (goods.getGoodsName() != null && !goods.getGoodsName().isEmpty()) {
            wrapper.like(Goods::getGoodsName, goods.getGoodsName());
        }
        if (goods.getCategoryId() != null) {
            wrapper.eq(Goods::getCategoryId, goods.getCategoryId());
        }

        // 1. 查询商品列表
        List<Goods> goodsList = goodsMapper.selectList(wrapper);

        // 2. 查询所有分类，转成 Map<id, 分类名称>
        List<Category> categoryList = categoryMapper.selectList(null);
        Map<Integer, String> categoryMap = categoryList.stream()
                .collect(Collectors.toMap(Category::getId, Category::getCategoryName));

        // 3. 给每个商品设置分类名称
        goodsList.forEach(goodsItem -> {
            Integer cid = goodsItem.getCategoryId();
            if (cid != null) {
                goodsItem.setCategoryName(categoryMap.get(cid));
            }
        });

        return goodsList;
    }

    // 新增商品
    @Override
    public String add(Goods goods) {
        // 商品名称不能重复（合理业务规则）
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

    // 修改商品
    @Override
    public String update(Goods goods) {
        if (goods.getId() == null) {
            throw new RuntimeException("商品ID不能为空");
        }

        // 商品名称重复校验（排除自己）
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

    // 删除商品
    @Override
    public String delete(Integer id) {
        int rows = goodsMapper.deleteById(id);
        if (rows > 0) {
            return "删除成功";
        } else {
            throw new RuntimeException("删除失败，数据不存在");
        }
    }
}
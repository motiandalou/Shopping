package com.example.shopping.module.goods.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.example.shopping.common.page.PageDTO;
import com.example.shopping.common.page.PageRespVO;
import com.example.shopping.module.category.entity.Category;
import com.example.shopping.module.category.mapper.CategoryMapper;
import com.example.shopping.module.goods.dto.GoodsQueryDTO;
import com.example.shopping.module.goods.entity.Goods;
import com.example.shopping.module.goods.mapper.GoodsMapper;
import com.example.shopping.module.goods.service.GoodsService;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.github.xiaoymin.knife4j.core.util.StrUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.*;
import org.springframework.stereotype.Service;
import cn.hutool.core.collection.CollUtil;


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

    @Override
    public PageRespVO<Goods> pageQuery(PageDTO pageDTO, GoodsQueryDTO queryDTO) {
        // 拼接动态查询条件
        LambdaQueryWrapper<Goods> wrapper = new LambdaQueryWrapper<>();
        // 模糊查询: 商品名称
        if(queryDTO != null && StrUtil.isNotBlank(queryDTO.getGoodsName())){
            wrapper.like(Goods::getGoodsName, queryDTO.getGoodsName());
        }
        // 模糊查询: 分类
        if (queryDTO != null && CollUtil.isNotEmpty(queryDTO.getCategoryIdList())) {
            wrapper.in(Goods::getCategoryId, queryDTO.getCategoryIdList());
        }
        // 分页
        PageHelper.startPage(pageDTO.getPageNum(), pageDTO.getPageSize());
        List<Goods> dataList = goodsMapper.selectList(wrapper);
        // PageInfo封装分页信息，调用build方法(大数据)
        PageInfo<Goods> pageInfo = new PageInfo<>(dataList);
        PageRespVO<Goods> pageResp = PageRespVO.build(pageInfo);
        // 缓存
        fillCategoryName(dataList);
        return pageResp;
    }

    /**
     * 作用：给商品列表批量补全分类名称，避免循环查数据库 N 次
     * @param list
     */
    private void fillCategoryName(List<Goods> list){
        // 一次性查出全部分类，只查 1 次库，之后走 Redis 缓存
        List<Category> allCat = getAllCategory();
        // 把全部分类转 Map：key=分类id，value=分类名字
        Map<Integer,String> catMap = allCat.stream()
                .collect(Collectors.toMap(Category::getId, Category::getCategoryName));
        list.forEach(item->{
            if(item.getCategoryId()!=null){
                item.setCategoryName(catMap.get(item.getCategoryId()));
            }
        });
    }

    /**
     * 商品详情缓存
     * @param id
     * @return
     */
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

    /**
     * 商品分类
     * @return
     */
    @Cacheable(cacheNames = "category", key = "'all'", unless = "#result == null || #result.isEmpty()")
    public List<Category> getAllCategory() {
        return categoryMapper.selectList(null);
    }

    /**
     * 新增
     * @param goods
     * @return
     */
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

    /**
     * 更新
     * @param goods
     * @return
     */
    @Override
    @CacheEvict(cacheNames = "goods", key = "'detail:' + #goods.id")
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

    /**
     * 删除
     * @param id
     * @return
     */
    @Override
    @CacheEvict(cacheNames = "goods", key = "'detail:' + #id")
    public String delete(Integer id) {
        int rows = goodsMapper.deleteById(id);

        if (rows > 0) {
            return "删除成功";
        } else {
            throw new RuntimeException("删除失败，数据不存在");
        }
    }
}
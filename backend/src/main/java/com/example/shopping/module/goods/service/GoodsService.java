package com.example.shopping.module.goods.service;

import com.example.shopping.module.goods.entity.Goods;

import java.util.List;

public interface GoodsService {

    // 列表
    List list(Goods goods);

    // 详情
    Goods getDetailById(Integer id);

    // 新增
    String add(Goods goods);

    // 修改
    String update(Goods goods);

    // 删除
    String delete(Integer id);
}
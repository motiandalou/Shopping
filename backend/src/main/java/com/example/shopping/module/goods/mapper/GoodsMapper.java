package com.example.shopping.module.goods.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.shopping.module.goods.entity.Goods;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface GoodsMapper extends BaseMapper<Goods> {
    // 统计总商品数
    @Select("SELECT COUNT(id) FROM t_goods")
    int countTotalGoods();
}
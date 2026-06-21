package com.example.shopping.module.hot.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.shopping.module.hot.dto.AdminHotGoodsVO;
import com.example.shopping.module.hot.dto.HotGoodsVO;
import com.example.shopping.module.hot.entity.GoodsHot;
import org.apache.ibatis.annotations.Select;

import java.util.List;

public interface GoodsHotMapper extends BaseMapper<GoodsHot> {

//    @Select("SELECT g.id, g.goods_name, g.price AS flash_price, g.price AS origin_price, 0 AS discount_rate, 5 AS rating, g.review_count, g.cover_img " +
//            "FROM goods_hot h " +
//            "LEFT JOIN t_goods g ON h.goods_id = g.id " +
//            "WHERE g.status = 1 " +
//            "ORDER BY h.sort DESC")
//    List<HotGoodsVO> selectAllHotGoods();

    @Select("SELECT g.id, g.goods_name, g.price AS flash_price, NULL AS origin_price, 0 AS discount_rate, 5 AS rating, g.review_count, g.cover_img " +
            "FROM goods_hot h " +
            "LEFT JOIN t_goods g ON h.goods_id = g.id " +
            "WHERE g.status = 1 " +
            "ORDER BY h.sort DESC")
    List<HotGoodsVO> selectAllHotGoods();

    @Select("SELECT h.id, h.goods_id, g.goods_name, h.sort, h.create_time " +
            "FROM goods_hot h " +
            "LEFT JOIN t_goods g ON h.goods_id = g.id " +
            "ORDER BY h.sort DESC, h.id DESC")
    List<AdminHotGoodsVO> selectAdminHotGoods();
}

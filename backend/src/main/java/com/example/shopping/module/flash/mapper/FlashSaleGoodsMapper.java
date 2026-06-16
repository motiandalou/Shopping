package com.example.shopping.module.flash.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.shopping.module.flash.dto.FlashSaleGoodsVO;
import com.example.shopping.module.flash.entity.FlashSaleGoods;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import java.util.List;

@Mapper
public interface FlashSaleGoodsMapper extends BaseMapper<FlashSaleGoods> {
    // 联查商品基础信息，返回首页展示VO
    @Select("SELECT g.id goodsId, g.goods_name goodsName, g.cover_img coverImg, g.price originPrice, f.flash_price flashPrice, f.discount_rate discountRate, g.review_count reviewCount " +
            "FROM flash_sale_goods f " +
            "LEFT JOIN t_goods g ON f.goods_id = g.id " +
            "WHERE f.activity_id = #{activityId} AND g.status = 1")
    List<FlashSaleGoodsVO> selectFlashGoodsByActivityId(@Param("activityId") Long activityId);
}
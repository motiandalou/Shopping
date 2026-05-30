package com.example.shopping.module.favorite.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.shopping.module.favorite.entity.Favorite;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface FavoriteMapper extends BaseMapper<Favorite> {
    /**
     * 批量查询当前用户已收藏的商品ID
     */
    @Select("<script>" +
            "SELECT goods_id FROM t_favorite WHERE user_id = #{userId} AND goods_id IN " +
            "<foreach collection='goodsIdList' item='item' open='(' separator=',' close=')'>#{item}</foreach>" +
            "</script>")
    List<Long> selectFavoritedGoodsIds(
            @Param("userId") Long userId,
            @Param("goodsIdList") List<Long> goodsIdList);
}
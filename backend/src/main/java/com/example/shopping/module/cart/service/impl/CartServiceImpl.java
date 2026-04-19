package com.example.shopping.module.cart.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.shopping.module.cart.entity.Cart;
import com.example.shopping.module.cart.mapper.CartMapper;
import com.example.shopping.module.cart.service.CartService;
import com.example.shopping.module.cart.vo.CartVO;
import com.example.shopping.module.goods.entity.Goods;
import com.example.shopping.module.goods.mapper.GoodsMapper;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class CartServiceImpl implements CartService {

    @Autowired
    private CartMapper cartMapper;

    @Autowired
    private GoodsMapper goodsMapper;

    // ====================== 加入购物车（新增/更新） ======================
    @Override
    public String addCart(Cart cart) {
        LambdaQueryWrapper<Cart> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Cart::getUserId, cart.getUserId());
        wrapper.eq(Cart::getGoodsId, cart.getGoodsId());

        Cart existCart = cartMapper.selectOne(wrapper);

        if (existCart != null) {
            existCart.setQuantity(existCart.getQuantity() + cart.getQuantity());
            existCart.setUpdateTime(LocalDateTime.now());
            cartMapper.updateById(existCart);
            return "购物车商品数量更新成功";
        } else {
            cart.setSelected(1);
            cart.setCreateTime(LocalDateTime.now());
            cart.setUpdateTime(LocalDateTime.now());
            cartMapper.insert(cart);
            return "加入购物车成功";
        }
    }

    // ====================== 查询当前用户购物车（原始） ======================
    @Override
    public List<Cart> getCartList(Long userId) {
        LambdaQueryWrapper<Cart> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Cart::getUserId, userId);
        return cartMapper.selectList(wrapper);
    }

    // ====================== 查询购物车 + 关联商品（给前端用） ======================
    @Override
    public List<CartVO> listCartWithGoods(Long userId) {
        LambdaQueryWrapper<Cart> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Cart::getUserId, userId);
        List<Cart> cartList = cartMapper.selectList(wrapper);

        if (cartList == null || cartList.isEmpty()) {
            return new ArrayList<>();
        }

        // 提取商品ID
        Set<Long> goodsIds = cartList.stream()
                .map(Cart::getGoodsId)
                .collect(Collectors.toSet());

        // 批量查询商品
        List<Goods> goodsList = goodsMapper.selectBatchIds(goodsIds);

        // 手动构建 Map，避免类型推断问题
        Map<Long, Goods> goodsMap = new HashMap<>();
        for (Goods goods : goodsList) {
            goodsMap.put(goods.getId(), goods);
        }

        // 组装 VO
        return cartList.stream().map(cart -> {
            CartVO vo = new CartVO();
            BeanUtils.copyProperties(cart, vo);
            Goods goods = goodsMap.get(cart.getGoodsId());
            if (goods != null) {
                vo.setGoodsName(goods.getGoodsName());
                vo.setCoverImg(goods.getCoverImg());
            }
            return vo;
        }).collect(Collectors.toList());
    }

    // ====================== 修改购物车数量 ======================
    @Override
    public String updateQuantity(Cart cart) {
        Cart oldCart = cartMapper.selectById(cart.getId());
        if (oldCart == null) {
            throw new RuntimeException("购物车记录不存在");
        }
        oldCart.setQuantity(cart.getQuantity());
        oldCart.setUpdateTime(LocalDateTime.now());
        cartMapper.updateById(oldCart);
        return "数量修改成功";
    }

    // ====================== 删除购物车 ======================
    @Override
    public String deleteCart(Long id) {
        int rows = cartMapper.deleteById(id);
        if (rows > 0) {
            return "删除成功";
        } else {
            throw new RuntimeException("删除失败，记录不存在");
        }
    }

    // ====================== 后台分页查询 ======================
    @Override
    public List<Cart> backList(Integer pageNum, Integer pageSize) {
        Page<Cart> page = new Page<>(pageNum, pageSize);
        cartMapper.selectPage(page, null);
        return page.getRecords();
    }

    @Override
    public void clearCartByUserId(Long userId) {
        cartMapper.delete(
                new LambdaQueryWrapper<Cart>()
                        .eq(Cart::getUserId, userId)
        );
    }
}
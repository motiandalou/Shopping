package com.example.shopping.module.cart.service;

import com.example.shopping.module.cart.entity.Cart;
import com.example.shopping.module.cart.vo.CartVO;

import java.util.List;

public interface CartService {
    String addCart(Cart cart);
    List<Cart> getCartList(Long userId);
    String updateQuantity(Cart cart);
    String deleteCart(Long id);
    List<Cart> backList(Integer pageNum, Integer pageSize);
    List<CartVO> listCartWithGoods(Long userId);
    void clearCartByUserId(Long userId);
}
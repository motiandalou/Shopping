package com.example.shopping.module.cart.controller;

import com.example.shopping.config.Result;
import com.example.shopping.module.cart.entity.Cart;
import com.example.shopping.module.cart.service.CartService;
import com.example.shopping.module.cart.vo.CartVO;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    // ====================== 用户端：查询我的购物车 + 关联商品（返回VO） ======================
    @GetMapping("/list")
    public Result<List<CartVO>> list(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        List<CartVO> cartList = cartService.listCartWithGoods(userId);
        return Result.success(cartList);
    }

    // ====================== 后台管理：购物车列表（分页） ======================
    @GetMapping("/backList")
    public Result<Map<String, Object>> backList(
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize
    ) {
        PageHelper.startPage(pageNum, pageSize);
        List<Cart> cartList = cartService.backList(pageNum, pageSize);
        PageInfo<Cart> pageInfo = new PageInfo<>(cartList);

        Map<String, Object> map = new HashMap<>();
        map.put("list", pageInfo.getList());
        map.put("total", pageInfo.getTotal());
        return Result.success(map);
    }

    // ====================== 加入购物车 ======================
    @PostMapping("/add")
    public Result<String> add(@RequestBody Cart cart, HttpServletRequest request) {
        try {
            Long userId = (Long) request.getAttribute("userId");
            cart.setUserId(userId);
            String msg = cartService.addCart(cart);
            return Result.success(msg);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    // ====================== 修改购物车（数量/选中状态） ======================
    @PutMapping("/update")
    public Result<String> update(@RequestBody Cart cart) {
        try {
            String msg = cartService.updateQuantity(cart);
            return Result.success(msg);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    // ====================== 删除购物车 ======================
    @DeleteMapping("/delete/{id}")
    public Result<String> delete(@PathVariable Long id) {
        try {
            String msg = cartService.deleteCart(id);
            return Result.success(msg);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    // 清空购物车
    @DeleteMapping("/clear")
    public Result<Void> clearCart(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        cartService.clearCartByUserId(userId);
        return Result.success();
    }
}
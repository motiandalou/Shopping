package com.example.shopping.module.cart.controller;

import com.example.shopping.config.Result;
import com.example.shopping.module.cart.entity.Cart;
import com.example.shopping.module.cart.service.CartService;
import com.example.shopping.module.cart.vo.CartVO;
import com.example.shopping.module.log.annotation.Log;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/cart")
@Tag(name = "购物车管理", description = "购物车查询、加入、修改、删除、清空接口")
public class CartController {

    @Autowired
    private CartService cartService;

    // ====================== 用户端：查询我的购物车 + 关联商品 ======================
    @GetMapping("/list")
    @Operation(summary = "查询当前用户购物车", description = "查询登录用户的购物车列表，携带商品信息")
    public Result<List<CartVO>> list(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        List<CartVO> cartList = cartService.listCartWithGoods(userId);
        return Result.success(cartList);
    }

    // ====================== 后台管理：购物车列表（分页） ======================
    @GetMapping("/backList")
    @Operation(summary = "后台分页查询购物车列表", description = "管理员查看所有用户购物车数据")
    public Result<Map<String, Object>> backList(
            @Parameter(description = "页码", example = "1") @RequestParam(defaultValue = "1") Integer pageNum,
            @Parameter(description = "每页条数", example = "10") @RequestParam(defaultValue = "10") Integer pageSize
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
    @Log(module = "购物车管理", operation = "加入购物车")
    @PostMapping("/add")
    @Operation(summary = "加入购物车", description = "用户将商品添加到购物车")
    public Result<String> add(
            @Parameter(description = "购物车信息", required = true) @RequestBody Cart cart,
            HttpServletRequest request) {
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
    @Log(module = "购物车管理", operation = "修改购物车")
    @PutMapping("/update")
    @Operation(summary = "修改购物车", description = "修改购物车商品数量、选中状态")
    public Result<String> update(
            @Parameter(description = "购物车信息", required = true) @RequestBody Cart cart) {
        try {
            String msg = cartService.updateQuantity(cart);
            return Result.success(msg);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    // ====================== 删除购物车 ======================
    @Log(module = "购物车管理", operation = "删除购物车")
    @DeleteMapping("/delete/{id}")
    @Operation(summary = "删除购物车商品", description = "根据购物车ID删除单个商品")
    public Result<String> delete(
            @Parameter(description = "购物车ID", required = true) @PathVariable Long id) {
        try {
            String msg = cartService.deleteCart(id);
            return Result.success(msg);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    // 清空购物车
    @Log(module = "购物车管理", operation = "清空购物车")
    @DeleteMapping("/clear")
    @Operation(summary = "清空当前用户购物车", description = "一键清空登录用户的所有购物车数据")
    public Result<Void> clearCart(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        cartService.clearCartByUserId(userId);
        return Result.success();
    }
}
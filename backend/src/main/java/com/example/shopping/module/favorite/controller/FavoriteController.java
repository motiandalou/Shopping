package com.example.shopping.module.favorite.controller;

import com.example.shopping.config.Result;
import com.example.shopping.module.favorite.entity.Favorite;
import com.example.shopping.module.favorite.service.FavoriteService;
import com.example.shopping.module.favorite.vo.FavoriteVO;
import com.example.shopping.module.log.annotation.Log;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import org.apache.kafka.common.utils.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/favorite")
@Tag(name = "商品收藏管理", description = "收藏查询、收藏、取消、删除、清空接口")
public class FavoriteController {

    @Autowired
    private FavoriteService favoriteService;

    // ====================== 用户端：查询我的收藏列表（带商品信息） ======================
    @GetMapping("/list")
    @Operation(summary = "查询当前用户收藏列表", description = "查询登录用户收藏，携带商品信息")
    public Result<List<FavoriteVO>> list(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        List<FavoriteVO> favoriteList = favoriteService.listFavoriteWithGoods(userId);
        return Result.success(favoriteList);
    }

    // ====================== 后台管理：收藏分页列表 ======================
    @GetMapping("/backList")
    @Operation(summary = "后台分页查询收藏列表", description = "管理员查看所有用户收藏数据")
    public Result<Map<String, Object>> backList(
            @Parameter(description = "页码", example = "1") @RequestParam(defaultValue = "1") Integer pageNum,
            @Parameter(description = "每页条数", example = "10") @RequestParam(defaultValue = "10") Integer pageSize
    ) {
        PageHelper.startPage(pageNum, pageSize);
        List<Favorite> favoriteList = favoriteService.backList(pageNum, pageSize);
        PageInfo<Favorite> pageInfo = new PageInfo<>(favoriteList);

        Map<String, Object> map = new HashMap<>();
        map.put("list", pageInfo.getList());
        map.put("total", pageInfo.getTotal());
        return Result.success(map);
    }

    // ====================== 收藏/取消收藏（核心接口） ======================
    @Log(module = "收藏管理", operation = "切换收藏状态")
    @PostMapping("/toggle")
    @Operation(summary = "收藏/取消收藏商品", description = "点击心形按钮切换收藏状态")
    public Result<String> toggle(
            @Parameter(description = "商品ID", required = true) @RequestParam Long goodsId,
            HttpServletRequest request) {
        try {
            Long userId = (Long) request.getAttribute("userId");
            String msg = favoriteService.toggleFavorite(userId, goodsId);
            return Result.success(msg);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    // ====================== 根据ID删除单条收藏 ======================
    @Log(module = "收藏管理", operation = "删除收藏")
    @DeleteMapping("/delete/{id}")
    @Operation(summary = "删除收藏", description = "根据收藏ID删除单条记录")
    public Result<String> delete(
            @Parameter(description = "收藏ID", required = true) @PathVariable Long id) {
        try {
            String msg = favoriteService.deleteFavorite(id);
            return Result.success(msg);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    // ====================== 清空当前用户所有收藏 ======================
    @Log(module = "收藏管理", operation = "清空收藏")
    @DeleteMapping("/clear")
    @Operation(summary = "清空收藏", description = "一键清空当前用户全部收藏")
    public Result<Void> clear(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        favoriteService.clearFavoriteByUserId(userId);
        return Result.success();
    }

    // ====================== 查询单个商品是否已收藏（前端状态回显） ======================
    @GetMapping("/state")
    @Operation(summary = "查询商品收藏状态", description = "判断当前用户是否收藏该商品")
    public Result<Boolean> getState(
            @Parameter(description = "商品ID", required = true) @RequestParam Long goodsId,
            HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        Boolean state = favoriteService.isFavorited(userId, goodsId);
        return Result.success(state);
    }

    @PostMapping("/batchState")
    @Operation(summary = "批量查询商品收藏状态", description = "传入多个商品ID集合，一次性返回当前用户所有商品收藏状态")
    @ApiResponse(responseCode = "200", description = "批量查询成功", content = @Content(schema = @Schema(implementation = Map.class)))
    public Result<Map<Long, Boolean>> getBatchFavoriteState(
            @Parameter(description = "商品ID集合", required = true)
            @RequestBody List<Long> goodsIdList,
            HttpServletRequest request) {
        // 获取当前登录用户ID
        Long userId = (Long) request.getAttribute("userId");
        // 空集合直接返回空Map
        if (goodsIdList == null || goodsIdList.isEmpty()) {
            return Result.success(Map.of());
        }
        Map<Long, Boolean> stateMap = favoriteService.getBatchState(userId, goodsIdList);
        return Result.success(stateMap);
    }
}
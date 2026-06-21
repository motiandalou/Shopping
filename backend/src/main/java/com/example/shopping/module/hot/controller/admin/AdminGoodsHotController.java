package com.example.shopping.module.hot.controller.admin;

import com.example.shopping.common.page.PageDTO;
import com.example.shopping.common.page.PageRespVO;
import com.example.shopping.common.result.Result;
import com.example.shopping.module.hot.dto.AdminHotGoodsVO;
import com.example.shopping.module.hot.entity.GoodsHot;
import com.example.shopping.module.hot.service.HotService;
import com.example.shopping.module.log.annotation.Log;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/hot")
@RequiredArgsConstructor
public class AdminGoodsHotController {
    private final HotService hotService;

    @Log(module = "商品管理", operation = "新增热销商品")
    @PostMapping("/add")
    @Operation(summary = "新增热销商品", description = "将指定商品加入热销列表")
    @CacheEvict(value = "hot", allEntries = true)
    public Result<String> add(
            @Parameter(description = "热销商品信息", required = true)
            @RequestBody @Valid GoodsHot goodsHot) {
        goodsHot.setId(null);
        goodsHot.setCreateTime(null);
        return Result.success(hotService.addHot(goodsHot));
    }

    @Log(module = "商品管理", operation = "修改热销排序权重")
    @PutMapping("/sort")
    @Operation(summary = "修改热销商品排序", description = "调整热销商品展示权重，数值越大越靠前")
    @CacheEvict(value = "hot", allEntries = true)
    public Result<String> updateSort(
            @Parameter(description = "热销更新信息", required = true)
            @RequestBody @Valid GoodsHot goodsHot) {
        goodsHot.setGoodsId(null);
        goodsHot.setCreateTime(null);
        return Result.success(hotService.updateHotSort(goodsHot));
    }

    @Log(module = "商品管理", operation = "移除热销商品")
    @DeleteMapping("/{id}")
    @Operation(summary = "删除热销记录", description = "根据主键移除热销商品")
    @CacheEvict(value = "hot", allEntries = true)
    public Result<String> delete(
            @PathVariable @Parameter(description = "热销记录主键ID") Long id) {
        return Result.success(hotService.deleteHot(id));
    }

    @GetMapping("/page")
    @Operation(summary = "分页查询热销商品", description = "分页获取所有热销商品关联数据")
    public Result<PageRespVO<AdminHotGoodsVO>> page(@Valid PageDTO pageDTO) {
        return Result.success(hotService.pageAdminHotGoods(pageDTO));
    }
}
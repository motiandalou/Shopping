package com.example.shopping.module.staff.controller;

import com.example.shopping.common.result.Result;
import com.example.shopping.module.log.annotation.Log;
import com.example.shopping.module.staff.entity.Staff;
import com.example.shopping.module.staff.service.StaffService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/staff")
@Tag(name = "后台员工管理", description = "员工信息、登录信息、增删改查、状态管理接口")
public class StaffController {

    @Autowired
    private StaffService staffService;

    // 获取当前登录员工信息
    @GetMapping("/info")
    @Operation(summary = "获取当前登录员工信息", description = "根据Token获取登录人详情")
    public Result<Staff> info(
            @Parameter(description = "请求头Token", required = true)
            @RequestHeader("Authorization") String auth) {
        String token = auth.replace("Bearer ", "");
        Staff staff = staffService.getStaffInfoByToken(token);
        return Result.success(staff);
    }

    // 员工列表
    @PostMapping("/list")
    @Operation(summary = "条件查询员工列表", description = "支持分页/筛选员工信息")
    public Result<List<Staff>> list(
            @Parameter(description = "查询条件", required = true)
            @RequestBody Staff staff) {
        return Result.success(staffService.list(staff));
    }

    // 修改员工状态
    @Log(module = "员工管理", operation = "修改员工状态")
    @PutMapping("/status/{id}")
    @Operation(summary = "修改员工状态", description = "启用/禁用员工账号")
    public Result<String> updateStatus(
            @Parameter(description = "员工ID", required = true, example = "1") @PathVariable Long id,
            @Parameter(description = "状态 0-禁用 1-启用", required = true, example = "1") @RequestParam Integer status) {
        return Result.success(staffService.updateStatus(id, status));
    }

    // 新增员工
    @Log(module = "员工管理", operation = "新增员工")
    @PostMapping("/add")
    @Operation(summary = "新增后台员工", description = "添加管理员/客服账号")
    public Result<Boolean> add(
            @Parameter(description = "员工信息", required = true)
            @RequestBody Staff staff) {
        // 校验账号是否重复
        Staff exist = staffService.getByUserName(staff.getUserName());
        if (exist != null) {
            return Result.error("登录账号已存在，请更换！");
        }
        return Result.success(staffService.save(staff));
    }

    // 修改员工
    @Log(module = "员工管理", operation = "修改员工信息")
    @PostMapping("/update")
    @Operation(summary = "修改员工信息", description = "编辑员工资料")
    public Result<Boolean> update(
            @Parameter(description = "员工信息", required = true)
            @RequestBody Staff staff) {
        return Result.success(staffService.updateById(staff));
    }

    // 删除员工
    @Log(module = "员工管理", operation = "删除员工")
    @DeleteMapping("/delete")
    @Operation(summary = "删除员工", description = "根据ID删除后台员工")
    public Result<Boolean> delete(
            @Parameter(description = "员工ID", required = true, example = "1")
            @RequestParam Long id) {
        return Result.success(staffService.removeById(id));
    }
}
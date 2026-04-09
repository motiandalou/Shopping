package com.example.shopping.config;

import lombok.Data;

@Data
public class Result<T> {

    // 200成功 500失败 401未登录
    private int code;

    // 提示信息
    private String msg;

    // 数据
    private T data;

    // ===================== 新增：是否成功（前端最需要） =====================
    private boolean success;

    // ===================== 1. 成功返回（带数据） =====================
    public static <T> Result<T> success(T data) {
        Result<T> r = new Result<>();
        r.setCode(200);
        r.setSuccess(true);
        r.setMsg("操作成功");
        r.setData(data);
        return r;
    }

    // ===================== 2. 成功返回（自定义消息 + 数据） =====================
    public static <T> Result<T> success(String msg, T data) {
        Result<T> r = new Result<>();
        r.setCode(200);
        r.setSuccess(true);
        r.setMsg(msg);
        r.setData(data);
        return r;
    }

    // ===================== 3. 成功返回（无数据） =====================
    public static <T> Result<T> success() {
        return success(null);
    }

    // ===================== 4. 失败返回（自定义消息） =====================
    public static <T> Result<T> error(String msg) {
        Result<T> r = new Result<>();
        r.setCode(500);
        r.setSuccess(false);
        r.setMsg(msg);
        r.setData(null);
        return r;
    }

    // ===================== 5. 失败返回（自定义code + 消息） =====================
    public static <T> Result<T> error(int code, String msg) {
        Result<T> r = new Result<>();
        r.setCode(code);
        r.setSuccess(false);
        r.setMsg(msg);
        r.setData(null);
        return r;
    }
}
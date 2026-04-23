package com.example.shopping.config;

import lombok.Data;
import java.io.Serializable;

@Data
public class Result<T> implements Serializable {

    // 固定序列化ID
    private static final long serialVersionUID = 1L;

    // 状态码常量
    public static final int SUCCESS = 200;
    public static final int ERROR = 500;
    public static final int UNAUTHORIZED = 401;

    // 200成功 500失败 401未登录
    private int code;

    // 提示信息
    private String msg;

    // 数据
    private T data;

    // 新增：是否成功
    private boolean success;

    // 成功返回（带数据）
    public static <T> Result<T> success(T data) {
        Result<T> r = new Result<>();
        r.setCode(SUCCESS);
        r.setSuccess(true);
        r.setMsg("操作成功");
        r.setData(data);
        return r;
    }

    // 成功返回（自定义消息 + 数据）
    public static <T> Result<T> success(String msg, T data) {
        Result<T> r = new Result<>();
        r.setCode(SUCCESS);
        r.setSuccess(true);
        r.setMsg(msg);
        r.setData(data);
        return r;
    }

    // 成功返回（无数据）
    public static <T> Result<T> success() {
        return success(null);
    }

    // 失败返回（自定义消息）
    public static <T> Result<T> error(String msg) {
        Result<T> r = new Result<>();
        r.setCode(ERROR);
        r.setSuccess(false);
        r.setMsg(msg);
        r.setData(null);
        return r;
    }

    // 失败返回（自定义code + 消息）
    public static <T> Result<T> error(int code, String msg) {
        Result<T> r = new Result<>();
        r.setCode(code);
        r.setSuccess(false);
        r.setMsg(msg);
        r.setData(null);
        return r;
    }

    // 未登录 401
    public static <T> Result<T> unauthorized() {
        Result<T> r = new Result<>();
        r.setCode(UNAUTHORIZED);
        r.setSuccess(false);
        r.setMsg("请先登录");
        r.setData(null);
        return r;
    }
}
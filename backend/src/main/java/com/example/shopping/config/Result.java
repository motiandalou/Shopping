package com.example.shopping.config;

import lombok.Data;

@Data
public class Result<T> {
    private int code;    // 200成功 500失败
    private String msg; // 提示信息
    private T data;     // 返回的数据

    // 1. 成功（带数据）
    public static <T> Result<T> success(T data) {
        Result<T> r = new Result<>();
        r.code = 200;
        r.msg = "操作成功";
        r.data = data;
        return r;
    }

    // 2. 成功（不带数据，只有提示）
    public static <T> Result<T> success() {
        return success(null);
    }

    // 3. 失败
    public static <T> Result<T> error(String msg) {
        Result<T> r = new Result<>();
        r.code = 500;
        r.msg = msg;
        r.data = null;
        return r;
    }
}
package com.example.shopping.common.exception;

/**
 * 自定义业务异常
 * 用于处理业务逻辑校验失败、权限不足等场景
 */
public class BusinessException extends RuntimeException {

    // 业务状态码，默认 500（业务错误）
    private final int code;

    // 错误信息
    private final String message;

    /**
     * 构造方法：仅传入错误信息（默认状态码 500）
     */
    public BusinessException(String message) {
        super(message);
        this.code = 500;
        this.message = message;
    }

    /**
     * 构造方法：传入状态码 + 错误信息
     */
    public BusinessException(int code, String message) {
        super(message);
        this.code = code;
        this.message = message;
    }

    /**
     * 构造方法：传入错误信息 + 异常原因
     */
    public BusinessException(String message, Throwable cause) {
        super(message, cause);
        this.code = 500;
        this.message = message;
    }

    // Getter 方法
    public int getCode() {
        return code;
    }

    @Override
    public String getMessage() {
        return message;
    }
}
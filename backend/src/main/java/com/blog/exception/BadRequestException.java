package com.blog.exception;

/**
 * 错误请求异常
 * 当客户端请求参数不正确、验证失败、业务逻辑错误时抛出此异常
 * 会被GlobalExceptionHandler捕获并返回400状态码
 *
 * 使用场景：
 * - 文件上传验证失败（文件类型不支持、大小超限等）
 * - 请求参数格式错误
 * - 业务规则验证失败
 */
public class BadRequestException extends RuntimeException {

    /**
     * 构造函数
     * @param message 错误消息
     */
    public BadRequestException(String message) {
        super(message);
    }
}

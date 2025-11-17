package com.blog.exception;

/**
 * 资源未找到异常
 * 当请求的资源（文章、用户、分类等）不存在时抛出此异常
 * 会被GlobalExceptionHandler捕获并返回404状态码
 */
public class ResourceNotFoundException extends RuntimeException {

    /**
     * 构造函数 - 自定义错误消息
     * @param message 错误消息
     */
    public ResourceNotFoundException(String message) {
        super(message);
    }

    /**
     * 构造函数 - 根据资源类型和ID生成错误消息
     * @param resource 资源类型（如"文章"、"用户"）
     * @param id 资源ID
     */
    public ResourceNotFoundException(String resource, Long id) {
        super(String.format("%s (ID: %d) 不存在", resource, id));
    }
}

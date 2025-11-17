package com.blog.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 统一错误响应数据传输对象
 * 用于向前端返回标准化的错误信息
 *
 * 响应示例：
 * {
 *   "timestamp": "2025-11-17T10:30:00",
 *   "status": 404,
 *   "error": "Not Found",
 *   "message": "文章 (ID: 123) 不存在",
 *   "path": "/api/posts/123"
 * }
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ErrorResponse {

    /** 错误发生时间 */
    private LocalDateTime timestamp;

    /** HTTP状态码 */
    private int status;

    /** 错误类型（如 Not Found, Bad Request） */
    private String error;

    /** 详细错误消息 */
    private String message;

    /** 请求路径 */
    private String path;

    /**
     * 便捷构造函数 - 自动设置时间戳为当前时间
     * @param status HTTP状态码
     * @param error 错误类型
     * @param message 错误消息
     * @param path 请求路径
     */
    public ErrorResponse(int status, String error, String message, String path) {
        this.timestamp = LocalDateTime.now();
        this.status = status;
        this.error = error;
        this.message = message;
        this.path = path;
    }
}

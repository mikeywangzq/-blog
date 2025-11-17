package com.blog.exception;

import com.blog.dto.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import java.util.HashMap;
import java.util.Map;

/**
 * 全局异常处理器
 *
 * 功能说明：
 * - 统一捕获和处理应用中抛出的各种异常
 * - 将异常转换为标准化的错误响应返回给前端
 * - 记录错误日志便于问题排查
 *
 * 处理的异常类型：
 * 1. ResourceNotFoundException - 资源未找到 (404)
 * 2. BadRequestException - 错误请求 (400)
 * 3. AuthenticationException - 认证失败 (401)
 * 4. AccessDeniedException - 权限不足 (403)
 * 5. MethodArgumentNotValidException - 参数验证失败 (400)
 * 6. MaxUploadSizeExceededException - 文件上传超限 (400)
 * 7. RuntimeException - 运行时异常 (400)
 * 8. Exception - 其他未知异常 (500)
 *
 * @RestControllerAdvice 注解说明：
 * - 自动应用于所有@RestController
 * - 集中处理所有Controller层抛出的异常
 * - 返回的对象会自动序列化为JSON
 */
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * 处理资源未找到异常
     *
     * 触发场景：查询文章、用户、分类等资源时，资源不存在
     * 返回状态码：404 Not Found
     *
     * @param ex 资源未找到异常
     * @param request HTTP请求对象
     * @return 标准化错误响应
     */
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFoundException(
            ResourceNotFoundException ex, HttpServletRequest request) {
        log.error("Resource not found: {}", ex.getMessage());
        ErrorResponse error = new ErrorResponse(
                HttpStatus.NOT_FOUND.value(),
                "Not Found",
                ex.getMessage(),
                request.getRequestURI()
        );
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    /**
     * 处理错误请求异常
     *
     * 触发场景：
     * - 文件上传验证失败（类型不支持、大小超限）
     * - 请求参数格式错误
     * - 业务规则验证失败
     * 返回状态码：400 Bad Request
     *
     * @param ex 错误请求异常
     * @param request HTTP请求对象
     * @return 标准化错误响应
     */
    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ErrorResponse> handleBadRequestException(
            BadRequestException ex, HttpServletRequest request) {
        log.error("Bad request: {}", ex.getMessage());
        ErrorResponse error = new ErrorResponse(
                HttpStatus.BAD_REQUEST.value(),
                "Bad Request",
                ex.getMessage(),
                request.getRequestURI()
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    /**
     * 处理认证异常
     *
     * 触发场景：用户登录时用户名或密码错误
     * 返回状态码：401 Unauthorized
     *
     * @param ex 认证异常
     * @param request HTTP请求对象
     * @return 标准化错误响应
     */
    @ExceptionHandler({AuthenticationException.class, BadCredentialsException.class})
    public ResponseEntity<ErrorResponse> handleAuthenticationException(
            Exception ex, HttpServletRequest request) {
        log.error("Authentication failed: {}", ex.getMessage());
        ErrorResponse error = new ErrorResponse(
                HttpStatus.UNAUTHORIZED.value(),
                "Unauthorized",
                "用户名或密码错误",
                request.getRequestURI()
        );
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
    }

    /**
     * 处理权限异常
     *
     * 触发场景：用户试图访问无权限的资源（如编辑他人文章）
     * 返回状态码：403 Forbidden
     *
     * @param ex 权限拒绝异常
     * @param request HTTP请求对象
     * @return 标准化错误响应
     */
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDeniedException(
            AccessDeniedException ex, HttpServletRequest request) {
        log.error("Access denied: {}", ex.getMessage());
        ErrorResponse error = new ErrorResponse(
                HttpStatus.FORBIDDEN.value(),
                "Forbidden",
                "没有权限访问该资源",
                request.getRequestURI()
        );
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
    }

    /**
     * 处理参数验证异常
     *
     * 触发场景：使用@Valid注解验证请求参数时，验证失败
     * 例如：字段为空、长度不符合要求、格式错误等
     * 返回状态码：400 Bad Request
     *
     * 响应格式包含所有验证失败的字段和错误信息
     *
     * @param ex 方法参数验证异常
     * @param request HTTP请求对象
     * @return 包含所有验证错误的响应
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationExceptions(
            MethodArgumentNotValidException ex, HttpServletRequest request) {
        log.error("Validation failed: {}", ex.getMessage());

        // 收集所有字段的验证错误
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });

        // 构建响应
        Map<String, Object> response = new HashMap<>();
        response.put("timestamp", java.time.LocalDateTime.now());
        response.put("status", HttpStatus.BAD_REQUEST.value());
        response.put("error", "Validation Failed");
        response.put("message", "输入参数验证失败");
        response.put("errors", errors); // 所有字段的验证错误
        response.put("path", request.getRequestURI());

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    /**
     * 处理文件上传大小超限异常
     *
     * 触发场景：上传的文件大小超过application.yml中配置的限制
     * 返回状态码：400 Bad Request
     *
     * @param ex 文件上传大小超限异常
     * @param request HTTP请求对象
     * @return 标准化错误响应
     */
    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<ErrorResponse> handleMaxUploadSizeExceededException(
            MaxUploadSizeExceededException ex, HttpServletRequest request) {
        log.error("File size exceeded: {}", ex.getMessage());
        ErrorResponse error = new ErrorResponse(
                HttpStatus.BAD_REQUEST.value(),
                "File Too Large",
                "上传文件大小超过限制",
                request.getRequestURI()
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    /**
     * 处理一般运行时异常
     *
     * 触发场景：应用抛出未被其他处理器捕获的RuntimeException
     * 返回状态码：400 Bad Request
     * 优先级：在Exception处理器之前执行
     *
     * @param ex 运行时异常
     * @param request HTTP请求对象
     * @return 标准化错误响应
     */
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ErrorResponse> handleRuntimeException(
            RuntimeException ex, HttpServletRequest request) {
        log.error("Runtime exception: {}", ex.getMessage(), ex);
        ErrorResponse error = new ErrorResponse(
                HttpStatus.BAD_REQUEST.value(),
                "Bad Request",
                ex.getMessage(),
                request.getRequestURI()
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    /**
     * 处理所有未捕获的异常（兜底处理器）
     *
     * 触发场景：应用抛出未被其他任何处理器捕获的异常
     * 返回状态码：500 Internal Server Error
     * 优先级：最低，所有其他处理器都无法处理时才会执行
     *
     * 安全说明：
     * - 不向前端返回详细的异常堆栈信息，防止信息泄露
     * - 详细错误已记录到日志中供开发者排查
     *
     * @param ex 任意异常
     * @param request HTTP请求对象
     * @return 标准化错误响应
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGlobalException(
            Exception ex, HttpServletRequest request) {
        log.error("Unexpected error occurred: {}", ex.getMessage(), ex);
        ErrorResponse error = new ErrorResponse(
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "Internal Server Error",
                "服务器内部错误，请稍后重试",
                request.getRequestURI()
        );
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
}

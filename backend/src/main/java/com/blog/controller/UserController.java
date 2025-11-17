package com.blog.controller;

import com.blog.dto.UpdateProfileRequest;
import com.blog.dto.UserProfileDTO;
import com.blog.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/**
 * 用户控制器
 *
 * 功能：
 * - 获取用户个人资料
 * - 更新用户信息
 * - 用户统计数据
 */
@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@Tag(name = "用户管理", description = "用户个人资料相关接口")
@CrossOrigin(origins = "*", maxAge = 3600)
public class UserController {

    private final UserService userService;

    /**
     * 获取当前登录用户的个人资料
     */
    @GetMapping("/profile")
    @Operation(summary = "获取当前用户个人资料")
    public ResponseEntity<UserProfileDTO> getCurrentUserProfile(Authentication authentication) {
        String username = authentication.getName();
        return ResponseEntity.ok(userService.getUserProfile(username));
    }

    /**
     * 根据用户名获取用户资料（公开信息）
     */
    @GetMapping("/{username}")
    @Operation(summary = "获取指定用户资料")
    public ResponseEntity<UserProfileDTO> getUserProfile(@PathVariable String username) {
        return ResponseEntity.ok(userService.getUserProfile(username));
    }

    /**
     * 更新当前用户的个人资料
     */
    @PutMapping("/profile")
    @Operation(summary = "更新个人资料")
    public ResponseEntity<UserProfileDTO> updateProfile(
            @Valid @RequestBody UpdateProfileRequest request,
            Authentication authentication) {
        String username = authentication.getName();
        return ResponseEntity.ok(userService.updateProfile(username, request));
    }
}

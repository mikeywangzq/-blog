package com.blog.controller;

import com.blog.dto.PostDTO;
import com.blog.service.FavoriteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/**
 * 收藏控制器
 *
 * 功能：
 * - 收藏文章
 * - 取消收藏
 * - 获取收藏列表
 * - 检查收藏状态
 */
@RestController
@RequestMapping("/favorites")
@RequiredArgsConstructor
@Tag(name = "收藏管理", description = "文章收藏相关接口")
@CrossOrigin(origins = "*", maxAge = 3600)
public class FavoriteController {

    private final FavoriteService favoriteService;

    /**
     * 收藏文章
     */
    @PostMapping("/post/{postId}")
    @Operation(summary = "收藏文章")
    public ResponseEntity<Void> favoritePost(
            @PathVariable Long postId,
            Authentication authentication) {
        String username = authentication.getName();
        favoriteService.favoritePost(postId, username);
        return ResponseEntity.ok().build();
    }

    /**
     * 取消收藏
     */
    @DeleteMapping("/post/{postId}")
    @Operation(summary = "取消收藏")
    public ResponseEntity<Void> unfavoritePost(
            @PathVariable Long postId,
            Authentication authentication) {
        String username = authentication.getName();
        favoriteService.unfavoritePost(postId, username);
        return ResponseEntity.noContent().build();
    }

    /**
     * 获取当前用户的收藏列表
     */
    @GetMapping
    @Operation(summary = "获取我的收藏")
    public ResponseEntity<Page<PostDTO>> getMyFavorites(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {

        String username = authentication.getName();
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return ResponseEntity.ok(favoriteService.getUserFavorites(username, pageable));
    }

    /**
     * 检查是否收藏了指定文章
     */
    @GetMapping("/post/{postId}/status")
    @Operation(summary = "检查收藏状态")
    public ResponseEntity<Boolean> isFavorited(
            @PathVariable Long postId,
            Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.ok(false);
        }
        String username = authentication.getName();
        return ResponseEntity.ok(favoriteService.isFavorited(postId, username));
    }

    /**
     * 获取文章的收藏数
     */
    @GetMapping("/post/{postId}/count")
    @Operation(summary = "获取文章收藏数")
    public ResponseEntity<Long> getFavoriteCount(@PathVariable Long postId) {
        return ResponseEntity.ok(favoriteService.getFavoriteCount(postId));
    }
}

package com.blog.controller;

import com.blog.service.LikeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/likes")
@RequiredArgsConstructor
@Tag(name = "点赞管理", description = "文章点赞相关接口")
@CrossOrigin(origins = "*", maxAge = 3600)
public class LikeController {

    private final LikeService likeService;

    @PostMapping("/post/{postId}")
    @Operation(summary = "点赞文章")
    public ResponseEntity<Void> likePost(
            @PathVariable Long postId,
            Authentication authentication) {
        String username = authentication.getName();
        likeService.likePost(postId, username);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/post/{postId}")
    @Operation(summary = "取消点赞")
    public ResponseEntity<Void> unlikePost(
            @PathVariable Long postId,
            Authentication authentication) {
        String username = authentication.getName();
        likeService.unlikePost(postId, username);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/post/{postId}/count")
    @Operation(summary = "获取文章点赞数")
    public ResponseEntity<Long> getLikeCount(@PathVariable Long postId) {
        return ResponseEntity.ok(likeService.getLikeCount(postId));
    }

    @GetMapping("/post/{postId}/status")
    @Operation(summary = "检查是否已点赞")
    public ResponseEntity<Boolean> isLiked(
            @PathVariable Long postId,
            Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.ok(false);
        }
        String username = authentication.getName();
        return ResponseEntity.ok(likeService.isLiked(postId, username));
    }
}

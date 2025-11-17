package com.blog.controller;

import com.blog.model.PostVersion;
import com.blog.service.PostVersionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 文章版本控制器
 * 提供文章版本历史和对比功能
 */
@RestController
@RequestMapping("/posts/{postId}/versions")
@RequiredArgsConstructor
@Tag(name = "文章版本", description = "文章版本历史管理接口")
public class PostVersionController {

    private final PostVersionService postVersionService;

    /**
     * 获取文章的版本历史列表
     */
    @GetMapping
    @Operation(summary = "获取版本历史", description = "获取指定文章的所有版本历史")
    public ResponseEntity<List<PostVersion>> getVersionHistory(@PathVariable Long postId) {
        List<PostVersion> versions = postVersionService.getVersionHistory(postId);
        return ResponseEntity.ok(versions);
    }

    /**
     * 分页获取文章的版本历史
     */
    @GetMapping("/page")
    @Operation(summary = "分页获取版本历史", description = "分页查询文章的版本历史")
    public ResponseEntity<Page<PostVersion>> getVersionHistoryPage(
            @PathVariable Long postId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Page<PostVersion> versions = postVersionService.getVersionHistoryPage(
            postId,
            PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "version"))
        );
        return ResponseEntity.ok(versions);
    }

    /**
     * 获取指定版本的内容
     */
    @GetMapping("/{version}")
    @Operation(summary = "获取指定版本", description = "获取文章的指定版本内容")
    public ResponseEntity<PostVersion> getVersion(
            @PathVariable Long postId,
            @PathVariable Integer version) {

        return postVersionService.getVersion(postId, version)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    /**
     * 对比两个版本
     */
    @GetMapping("/compare")
    @Operation(summary = "对比版本", description = "对比文章的两个版本差异")
    public ResponseEntity<PostVersionService.VersionComparison> compareVersions(
            @PathVariable Long postId,
            @RequestParam Integer v1,
            @RequestParam Integer v2) {

        try {
            PostVersionService.VersionComparison comparison =
                postVersionService.compareVersions(postId, v1, v2);
            return ResponseEntity.ok(comparison);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * 获取版本统计信息
     */
    @GetMapping("/stats")
    @Operation(summary = "获取版本统计", description = "获取文章的版本统计信息")
    public ResponseEntity<VersionStats> getVersionStats(@PathVariable Long postId) {
        Long count = postVersionService.getVersionCount(postId);
        return ResponseEntity.ok(new VersionStats(postId, count));
    }

    /**
     * 版本统计信息DTO
     */
    private record VersionStats(
        Long postId,
        Long totalVersions
    ) {}
}

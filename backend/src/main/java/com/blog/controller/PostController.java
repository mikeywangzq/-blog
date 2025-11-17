package com.blog.controller;

import com.blog.dto.ArchiveDTO;
import com.blog.dto.CreatePostRequest;
import com.blog.dto.PostDTO;
import com.blog.service.PostService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/posts")
@RequiredArgsConstructor
@Tag(name = "文章管理", description = "博客文章相关接口")
@CrossOrigin(origins = "*", maxAge = 3600)
public class PostController {

    private final PostService postService;

    @GetMapping
    @Operation(summary = "获取所有已发布文章（分页）")
    public ResponseEntity<Page<PostDTO>> getAllPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String direction) {

        Sort.Direction sortDirection = direction.equalsIgnoreCase("ASC") ?
                Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));

        return ResponseEntity.ok(postService.getAllPublishedPosts(pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "根据ID获取文章详情")
    public ResponseEntity<PostDTO> getPostById(@PathVariable Long id) {
        postService.incrementViews(id);
        return ResponseEntity.ok(postService.getPostById(id));
    }

    @PostMapping
    @Operation(summary = "创建新文章")
    public ResponseEntity<PostDTO> createPost(
            @Valid @RequestBody CreatePostRequest request,
            Authentication authentication) {
        String username = authentication.getName();
        return ResponseEntity.ok(postService.createPost(request, username));
    }

    @PutMapping("/{id}")
    @Operation(summary = "更新文章")
    public ResponseEntity<PostDTO> updatePost(
            @PathVariable Long id,
            @Valid @RequestBody CreatePostRequest request) {
        return ResponseEntity.ok(postService.updatePost(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "删除文章")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        postService.deletePost(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    @Operation(summary = "搜索文章")
    public ResponseEntity<Page<PostDTO>> searchPosts(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(postService.searchPosts(keyword, pageable));
    }

    @GetMapping("/popular")
    @Operation(summary = "获取热门文章")
    public ResponseEntity<List<PostDTO>> getPopularPosts() {
        return ResponseEntity.ok(postService.getPopularPosts());
    }

    @GetMapping("/recent")
    @Operation(summary = "获取最新文章")
    public ResponseEntity<List<PostDTO>> getRecentPosts() {
        return ResponseEntity.ok(postService.getRecentPosts());
    }

    // ==================== 草稿相关接口 ====================

    @GetMapping("/drafts")
    @Operation(summary = "获取我的草稿")
    public ResponseEntity<Page<PostDTO>> getMyDrafts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {

        String username = authentication.getName();
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "updatedAt"));
        return ResponseEntity.ok(postService.getUserDrafts(username, pageable));
    }

    @GetMapping("/my-posts")
    @Operation(summary = "获取我的所有文章")
    public ResponseEntity<Page<PostDTO>> getMyAllPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {

        String username = authentication.getName();
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "updatedAt"));
        return ResponseEntity.ok(postService.getUserAllPosts(username, pageable));
    }

    // ==================== 归档相关接口 ====================

    @GetMapping("/archives")
    @Operation(summary = "获取归档统计")
    public ResponseEntity<List<ArchiveDTO>> getArchives() {
        return ResponseEntity.ok(postService.getArchiveStats());
    }

    @GetMapping("/archives/{year}/{month}")
    @Operation(summary = "获取指定年月的文章")
    public ResponseEntity<Page<PostDTO>> getPostsByYearMonth(
            @PathVariable Integer year,
            @PathVariable Integer month,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return ResponseEntity.ok(postService.getPostsByYearMonth(year, month, pageable));
    }
}

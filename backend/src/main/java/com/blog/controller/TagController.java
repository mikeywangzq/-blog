package com.blog.controller;

import com.blog.dto.PostDTO;
import com.blog.dto.TagDTO;
import com.blog.service.PostService;
import com.blog.service.TagService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 标签控制器
 *
 * 功能：
 * - 获取所有标签
 * - 获取热门标签（标签云）
 * - 搜索标签（自动补全）
 * - 按标签筛选文章
 */
@RestController
@RequestMapping("/tags")
@RequiredArgsConstructor
@Tag(name = "标签管理", description = "文章标签相关接口")
@CrossOrigin(origins = "*", maxAge = 3600)
public class TagController {

    private final TagService tagService;
    private final PostService postService;

    /**
     * 获取所有标签
     */
    @GetMapping
    @Operation(summary = "获取所有标签")
    public ResponseEntity<List<TagDTO>> getAllTags() {
        return ResponseEntity.ok(tagService.getAllTags());
    }

    /**
     * 获取热门标签（标签云）
     */
    @GetMapping("/popular")
    @Operation(summary = "获取热门标签")
    public ResponseEntity<List<TagDTO>> getPopularTags() {
        return ResponseEntity.ok(tagService.getPopularTags());
    }

    /**
     * 搜索标签（自动补全）
     */
    @GetMapping("/search")
    @Operation(summary = "搜索标签")
    public ResponseEntity<List<TagDTO>> searchTags(@RequestParam String keyword) {
        return ResponseEntity.ok(tagService.searchTags(keyword));
    }

    /**
     * 根据标签ID获取文章列表
     */
    @GetMapping("/{tagId}/posts")
    @Operation(summary = "根据标签获取文章")
    public ResponseEntity<Page<PostDTO>> getPostsByTag(
            @PathVariable Long tagId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return ResponseEntity.ok(postService.getPostsByTag(tagId, pageable));
    }
}

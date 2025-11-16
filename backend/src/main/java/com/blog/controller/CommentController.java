package com.blog.controller;

import com.blog.dto.CommentDTO;
import com.blog.dto.CreateCommentRequest;
import com.blog.service.CommentService;
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

@RestController
@RequestMapping("/comments")
@RequiredArgsConstructor
@Tag(name = "评论管理", description = "文章评论相关接口")
@CrossOrigin(origins = "*", maxAge = 3600)
public class CommentController {

    private final CommentService commentService;

    @GetMapping("/post/{postId}")
    @Operation(summary = "获取文章评论列表")
    public ResponseEntity<Page<CommentDTO>> getCommentsByPostId(
            @PathVariable Long postId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return ResponseEntity.ok(commentService.getCommentsByPostId(postId, pageable));
    }

    @PostMapping
    @Operation(summary = "创建评论")
    public ResponseEntity<CommentDTO> createComment(
            @Valid @RequestBody CreateCommentRequest request,
            Authentication authentication) {
        String username = authentication.getName();
        return ResponseEntity.ok(commentService.createComment(request, username));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "删除评论")
    public ResponseEntity<Void> deleteComment(
            @PathVariable Long id,
            Authentication authentication) {
        String username = authentication.getName();
        commentService.deleteComment(id, username);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/post/{postId}/count")
    @Operation(summary = "获取文章评论数量")
    public ResponseEntity<Long> getCommentCount(@PathVariable Long postId) {
        return ResponseEntity.ok(commentService.getCommentCount(postId));
    }
}

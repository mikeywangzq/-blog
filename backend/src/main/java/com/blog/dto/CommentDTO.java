package com.blog.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommentDTO {
    private Long id;
    private Long postId;
    private Long userId;
    private String username;
    private String userAvatar;
    private Long parentId;
    private String content;
    private LocalDateTime createdAt;
    private List<CommentDTO> replies;
}

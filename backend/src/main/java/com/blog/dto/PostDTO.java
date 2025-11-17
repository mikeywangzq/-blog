package com.blog.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PostDTO {
    private Long id;
    private String title;
    private String content;
    private String summary;
    private String coverImage;
    private Long categoryId;
    private String categoryName;
    private Long authorId;
    private String authorName;
    private Boolean published;
    private Integer views;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String tags;
    private Long commentCount;
    private Long likeCount;
}

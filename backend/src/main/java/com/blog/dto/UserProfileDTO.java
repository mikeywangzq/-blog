package com.blog.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 用户个人资料DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileDTO {
    private Long id;
    private String username;
    private String email;
    private String nickname;
    private String avatar;
    private String bio;
    private String role;
    private LocalDateTime createdAt;

    // 统计数据
    private Long postCount;          // 文章总数
    private Long publishedPostCount; // 已发布文章数
    private Long totalViews;         // 总浏览量
    private Long favoriteCount;      // 收藏文章数
}

package com.blog.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

/**
 * 文章版本历史实体
 * 记录文章的每次修改历史，支持版本回溯
 */
@Entity
@Table(name = "post_versions", indexes = {
    @Index(name = "idx_post_id", columnList = "post_id"),
    @Index(name = "idx_post_version", columnList = "post_id, version"),
    @Index(name = "idx_created_at", columnList = "created_at")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class PostVersion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 关联的文章ID
     */
    @Column(name = "post_id", nullable = false)
    private Long postId;

    /**
     * 版本号（从1开始递增）
     */
    @Column(nullable = false)
    private Integer version;

    /**
     * 标题快照
     */
    @Column(nullable = false, length = 200)
    private String title;

    /**
     * 内容快照
     */
    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    /**
     * 摘要快照
     */
    @Column(length = 500)
    private String summary;

    /**
     * 封面图快照
     */
    @Column(length = 500)
    private String coverImage;

    /**
     * 标签快照
     */
    @Column(length = 1000)
    private String tags;

    /**
     * 修改备注
     */
    @Column(length = 200)
    private String changeNote;

    /**
     * 创建时间
     */
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    /**
     * 创建者ID
     */
    @Column(name = "created_by")
    private Long createdBy;

    /**
     * 创建者用户名（冗余字段，避免联表查询）
     */
    @Column(name = "created_by_username", length = 50)
    private String createdByUsername;

    /**
     * 构造函数 - 从Post创建版本
     */
    public PostVersion(Post post, Integer version, String changeNote) {
        this.postId = post.getId();
        this.version = version;
        this.title = post.getTitle();
        this.content = post.getContent();
        this.summary = post.getSummary();
        this.coverImage = post.getCoverImage();
        this.tags = post.getTags();
        this.changeNote = changeNote;
        this.createdBy = post.getAuthor() != null ? post.getAuthor().getId() : null;
        this.createdByUsername = post.getAuthor() != null ? post.getAuthor().getUsername() : null;
    }
}

package com.blog.repository;

import com.blog.model.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

    Page<Post> findByPublishedTrue(Pageable pageable);

    Page<Post> findByCategoryIdAndPublishedTrue(Long categoryId, Pageable pageable);

    Page<Post> findByAuthorIdAndPublishedTrue(Long authorId, Pageable pageable);

    @Query("SELECT p FROM Post p WHERE p.published = true AND " +
           "(LOWER(p.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(p.content) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Post> searchPublishedPosts(String keyword, Pageable pageable);

    List<Post> findTop5ByPublishedTrueOrderByViewsDesc();

    List<Post> findTop5ByPublishedTrueOrderByCreatedAtDesc();

    // ==================== 草稿相关 ====================

    /**
     * 获取用户的草稿（未发布的文章）
     */
    Page<Post> findByAuthorIdAndPublishedFalse(Long authorId, Pageable pageable);

    /**
     * 获取用户的所有文章（包括草稿和已发布）
     */
    Page<Post> findByAuthorId(Long authorId, Pageable pageable);

    /**
     * 统计用户的文章总数
     */
    Long countByAuthorId(Long authorId);

    /**
     * 统计用户的已发布文章数
     */
    Long countByAuthorIdAndPublishedTrue(Long authorId);

    // ==================== 标签相关 ====================

    /**
     * 根据标签查询已发布文章
     */
    @Query("SELECT p FROM Post p JOIN p.tagList t WHERE t.id = :tagId AND p.published = true")
    Page<Post> findByTagIdAndPublishedTrue(Long tagId, Pageable pageable);
}

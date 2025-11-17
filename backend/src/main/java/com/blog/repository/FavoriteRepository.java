package com.blog.repository;

import com.blog.model.Favorite;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;

/**
 * 收藏数据访问层
 */
@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, Long> {

    /**
     * 根据用户ID获取收藏列表（分页）
     */
    Page<Favorite> findByUserId(Long userId, Pageable pageable);

    /**
     * 检查用户是否收藏了指定文章
     */
    boolean existsByUserIdAndPostId(Long userId, Long postId);

    /**
     * 统计用户收藏数量
     */
    Long countByUserId(Long userId);

    /**
     * 统计文章被收藏数量
     */
    Long countByPostId(Long postId);

    /**
     * 取消收藏
     */
    @Modifying
    void deleteByUserIdAndPostId(Long userId, Long postId);
}

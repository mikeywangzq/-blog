package com.blog.repository;

import com.blog.model.PostVersion;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 文章版本Repository
 */
@Repository
public interface PostVersionRepository extends JpaRepository<PostVersion, Long> {

    /**
     * 获取文章的所有版本历史
     */
    List<PostVersion> findByPostIdOrderByVersionDesc(Long postId);

    /**
     * 分页获取文章的版本历史
     */
    Page<PostVersion> findByPostIdOrderByVersionDesc(Long postId, Pageable pageable);

    /**
     * 获取文章的指定版本
     */
    Optional<PostVersion> findByPostIdAndVersion(Long postId, Integer version);

    /**
     * 获取文章的最新版本号
     */
    @Query("SELECT MAX(pv.version) FROM PostVersion pv WHERE pv.postId = :postId")
    Integer findLatestVersionNumber(Long postId);

    /**
     * 统计文章的版本数量
     */
    Long countByPostId(Long postId);

    /**
     * 删除文章的所有版本历史
     */
    void deleteByPostId(Long postId);
}

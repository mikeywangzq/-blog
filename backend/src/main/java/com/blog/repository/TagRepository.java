package com.blog.repository;

import com.blog.model.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 标签数据访问层
 */
@Repository
public interface TagRepository extends JpaRepository<Tag, Long> {

    /**
     * 根据名称查找标签
     */
    Optional<Tag> findByName(String name);

    /**
     * 检查标签名是否存在
     */
    boolean existsByName(String name);

    /**
     * 获取热门标签（按使用次数降序）
     */
    List<Tag> findTop20ByOrderByUseCountDesc();

    /**
     * 搜索标签（名称模糊匹配）
     */
    @Query("SELECT t FROM Tag t WHERE t.name LIKE %:keyword% ORDER BY t.useCount DESC")
    List<Tag> searchByName(String keyword);
}

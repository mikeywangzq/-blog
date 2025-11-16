package com.blog.repository;

import com.blog.model.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    @EntityGraph(attributePaths = {"user", "post"})
    @Query("SELECT c FROM Comment c WHERE c.post.id = :postId AND c.parent IS NULL AND c.deleted = false")
    Page<Comment> findByPostIdAndParentIsNull(Long postId, Pageable pageable);

    @EntityGraph(attributePaths = {"user"})
    @Query("SELECT c FROM Comment c WHERE c.parent.id = :parentId AND c.deleted = false")
    List<Comment> findByParentId(Long parentId);

    Long countByPostIdAndDeletedFalse(Long postId);
}

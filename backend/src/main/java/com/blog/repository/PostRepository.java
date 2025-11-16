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
}

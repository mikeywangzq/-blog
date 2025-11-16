package com.blog.service;

import com.blog.dto.CreatePostRequest;
import com.blog.dto.PostDTO;
import com.blog.model.Category;
import com.blog.model.Post;
import com.blog.model.User;
import com.blog.repository.CategoryRepository;
import com.blog.repository.CommentRepository;
import com.blog.repository.LikeRepository;
import com.blog.repository.PostRepository;
import com.blog.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final CommentRepository commentRepository;
    private final LikeRepository likeRepository;

    @Transactional(readOnly = true)
    public Page<PostDTO> getAllPublishedPosts(Pageable pageable) {
        return postRepository.findByPublishedTrue(pageable)
                .map(this::convertToDTO);
    }

    @Transactional(readOnly = true)
    public PostDTO getPostById(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("文章不存在"));
        return convertToDTO(post);
    }

    @Transactional
    public PostDTO createPost(CreatePostRequest request, String username) {
        User author = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("用户不存在"));

        Post post = new Post();
        post.setTitle(request.getTitle());
        post.setContent(request.getContent());
        post.setSummary(request.getSummary());
        post.setCoverImage(request.getCoverImage());
        post.setPublished(request.getPublished());
        post.setTags(request.getTags());
        post.setAuthor(author);

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("分类不存在"));
            post.setCategory(category);
        }

        Post savedPost = postRepository.save(post);
        return convertToDTO(savedPost);
    }

    @Transactional
    public PostDTO updatePost(Long id, CreatePostRequest request) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("文章不存在"));

        post.setTitle(request.getTitle());
        post.setContent(request.getContent());
        post.setSummary(request.getSummary());
        post.setCoverImage(request.getCoverImage());
        post.setPublished(request.getPublished());
        post.setTags(request.getTags());

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("分类不存在"));
            post.setCategory(category);
        }

        Post updatedPost = postRepository.save(post);
        return convertToDTO(updatedPost);
    }

    @Transactional
    public void deletePost(Long id) {
        if (!postRepository.existsById(id)) {
            throw new RuntimeException("文章不存在");
        }
        postRepository.deleteById(id);
    }

    @Transactional
    public void incrementViews(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("文章不存在"));
        post.setViews(post.getViews() + 1);
        postRepository.save(post);
    }

    @Transactional(readOnly = true)
    public Page<PostDTO> searchPosts(String keyword, Pageable pageable) {
        return postRepository.searchPublishedPosts(keyword, pageable)
                .map(this::convertToDTO);
    }

    @Transactional(readOnly = true)
    public List<PostDTO> getPopularPosts() {
        return postRepository.findTop5ByPublishedTrueOrderByViewsDesc()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PostDTO> getRecentPosts() {
        return postRepository.findTop5ByPublishedTrueOrderByCreatedAtDesc()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private PostDTO convertToDTO(Post post) {
        PostDTO dto = new PostDTO();
        dto.setId(post.getId());
        dto.setTitle(post.getTitle());
        dto.setContent(post.getContent());
        dto.setSummary(post.getSummary());
        dto.setCoverImage(post.getCoverImage());
        dto.setPublished(post.getPublished());
        dto.setViews(post.getViews());
        dto.setCreatedAt(post.getCreatedAt());
        dto.setUpdatedAt(post.getUpdatedAt());
        dto.setTags(post.getTags());

        if (post.getAuthor() != null) {
            dto.setAuthorId(post.getAuthor().getId());
            dto.setAuthorName(post.getAuthor().getNickname() != null ?
                    post.getAuthor().getNickname() : post.getAuthor().getUsername());
        }

        if (post.getCategory() != null) {
            dto.setCategoryId(post.getCategory().getId());
            dto.setCategoryName(post.getCategory().getName());
        }

        // 添加评论数和点赞数
        dto.setCommentCount(commentRepository.countByPostIdAndDeletedFalse(post.getId()));
        dto.setLikeCount(likeRepository.countByPostId(post.getId()));

        return dto;
    }
}

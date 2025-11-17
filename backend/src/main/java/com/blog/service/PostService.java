package com.blog.service;

import com.blog.dto.CreatePostRequest;
import com.blog.dto.PostDTO;
import com.blog.exception.ResourceNotFoundException;
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
import java.util.Map;
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
        Page<Post> posts = postRepository.findByPublishedTrue(pageable);

        // 批量获取统计数据，避免N+1查询
        List<Long> postIds = posts.getContent().stream()
                .map(Post::getId)
                .collect(Collectors.toList());

        Map<Long, Long> commentCounts = getCommentCountsForPosts(postIds);
        Map<Long, Long> likeCounts = getLikeCountsForPosts(postIds);

        return posts.map(post -> convertToDTO(post,
                commentCounts.getOrDefault(post.getId(), 0L),
                likeCounts.getOrDefault(post.getId(), 0L)));
    }

    @Transactional(readOnly = true)
    public PostDTO getPostById(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("文章", id));
        return convertToDTO(post);
    }

    @Transactional
    public PostDTO createPost(CreatePostRequest request, String username) {
        User author = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("用户不存在"));

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
                    .orElseThrow(() -> new ResourceNotFoundException("分类", request.getCategoryId()));
            post.setCategory(category);
        }

        Post savedPost = postRepository.save(post);
        return convertToDTO(savedPost);
    }

    @Transactional
    public PostDTO updatePost(Long id, CreatePostRequest request) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("文章", id));

        post.setTitle(request.getTitle());
        post.setContent(request.getContent());
        post.setSummary(request.getSummary());
        post.setCoverImage(request.getCoverImage());
        post.setPublished(request.getPublished());
        post.setTags(request.getTags());

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("分类", request.getCategoryId()));
            post.setCategory(category);
        }

        Post updatedPost = postRepository.save(post);
        return convertToDTO(updatedPost);
    }

    @Transactional
    public void deletePost(Long id) {
        if (!postRepository.existsById(id)) {
            throw new ResourceNotFoundException("文章", id);
        }
        postRepository.deleteById(id);
    }

    @Transactional
    public void incrementViews(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("文章", id));
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

    // 批量获取评论数统计
    private Map<Long, Long> getCommentCountsForPosts(List<Long> postIds) {
        if (postIds.isEmpty()) {
            return new java.util.HashMap<>();
        }
        // 这里需要在CommentRepository添加批量查询方法
        // 暂时使用单个查询（后续优化）
        return postIds.stream()
                .collect(Collectors.toMap(
                        id -> id,
                        id -> commentRepository.countByPostIdAndDeletedFalse(id)
                ));
    }

    // 批量获取点赞数统计
    private Map<Long, Long> getLikeCountsForPosts(List<Long> postIds) {
        if (postIds.isEmpty()) {
            return new java.util.HashMap<>();
        }
        return postIds.stream()
                .collect(Collectors.toMap(
                        id -> id,
                        id -> likeRepository.countByPostId(id)
                ));
    }

    // 重载方法：用于批量转换时传入预查询的统计数据
    private PostDTO convertToDTO(Post post, Long commentCount, Long likeCount) {
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

        dto.setCommentCount(commentCount);
        dto.setLikeCount(likeCount);

        return dto;
    }

    // 原始方法：用于单个查询
    private PostDTO convertToDTO(Post post) {
        return convertToDTO(post,
                commentRepository.countByPostIdAndDeletedFalse(post.getId()),
                likeRepository.countByPostId(post.getId()));
    }
}

package com.blog.service;

import com.blog.dto.CommentDTO;
import com.blog.dto.CreateCommentRequest;
import com.blog.model.Comment;
import com.blog.model.Post;
import com.blog.model.User;
import com.blog.repository.CommentRepository;
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
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public Page<CommentDTO> getCommentsByPostId(Long postId, Pageable pageable) {
        return commentRepository.findByPostIdAndParentIsNull(postId, pageable)
                .map(this::convertToDTO);
    }

    @Transactional
    public CommentDTO createComment(CreateCommentRequest request, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("用户不存在"));

        Post post = postRepository.findById(request.getPostId())
                .orElseThrow(() -> new RuntimeException("文章不存在"));

        Comment comment = new Comment();
        comment.setPost(post);
        comment.setUser(user);
        comment.setContent(request.getContent());

        if (request.getParentId() != null) {
            Comment parent = commentRepository.findById(request.getParentId())
                    .orElseThrow(() -> new RuntimeException("父评论不存在"));
            comment.setParent(parent);
        }

        Comment savedComment = commentRepository.save(comment);
        return convertToDTO(savedComment);
    }

    @Transactional
    public void deleteComment(Long id, String username) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("评论不存在"));

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("用户不存在"));

        if (!comment.getUser().getId().equals(user.getId()) &&
            !user.getRole().equals(User.Role.ADMIN)) {
            throw new RuntimeException("无权删除此评论");
        }

        comment.setDeleted(true);
        commentRepository.save(comment);
    }

    @Transactional(readOnly = true)
    public Long getCommentCount(Long postId) {
        return commentRepository.countByPostIdAndDeletedFalse(postId);
    }

    private CommentDTO convertToDTO(Comment comment) {
        CommentDTO dto = new CommentDTO();
        dto.setId(comment.getId());
        dto.setPostId(comment.getPost().getId());
        dto.setUserId(comment.getUser().getId());
        dto.setUsername(comment.getUser().getNickname() != null ?
                comment.getUser().getNickname() : comment.getUser().getUsername());
        dto.setUserAvatar(comment.getUser().getAvatar());
        dto.setContent(comment.getContent());
        dto.setCreatedAt(comment.getCreatedAt());

        if (comment.getParent() != null) {
            dto.setParentId(comment.getParent().getId());
        }

        // 加载回复
        List<Comment> replies = commentRepository.findByParentId(comment.getId());
        dto.setReplies(replies.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList()));

        return dto;
    }
}

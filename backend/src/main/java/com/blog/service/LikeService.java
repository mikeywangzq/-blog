package com.blog.service;

import com.blog.model.Like;
import com.blog.model.Post;
import com.blog.model.User;
import com.blog.repository.LikeRepository;
import com.blog.repository.PostRepository;
import com.blog.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class LikeService {

    private final LikeRepository likeRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    @Transactional
    public void likePost(Long postId, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("用户不存在"));

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("文章不存在"));

        if (likeRepository.existsByUserIdAndPostId(user.getId(), postId)) {
            throw new RuntimeException("已经点赞过该文章");
        }

        Like like = new Like();
        like.setUser(user);
        like.setPost(post);
        likeRepository.save(like);
    }

    @Transactional
    public void unlikePost(Long postId, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("用户不存在"));

        likeRepository.deleteByUserIdAndPostId(user.getId(), postId);
    }

    @Transactional(readOnly = true)
    public Long getLikeCount(Long postId) {
        return likeRepository.countByPostId(postId);
    }

    @Transactional(readOnly = true)
    public Boolean isLiked(Long postId, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("用户不存在"));

        return likeRepository.existsByUserIdAndPostId(user.getId(), postId);
    }
}

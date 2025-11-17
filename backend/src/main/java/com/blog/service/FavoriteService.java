package com.blog.service;

import com.blog.dto.PostDTO;
import com.blog.exception.BadRequestException;
import com.blog.exception.ResourceNotFoundException;
import com.blog.model.Favorite;
import com.blog.model.Post;
import com.blog.model.User;
import com.blog.repository.FavoriteRepository;
import com.blog.repository.PostRepository;
import com.blog.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 收藏服务类
 *
 * 功能：
 * - 收藏/取消收藏文章
 * - 查询用户的收藏列表
 * - 检查收藏状态
 * - 统计收藏数量
 */
@Service
@RequiredArgsConstructor
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final PostService postService;

    /**
     * 收藏文章
     */
    @Transactional
    public void favoritePost(Long postId, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("用户不存在"));

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("文章", postId));

        // 检查是否已收藏
        if (favoriteRepository.existsByUserIdAndPostId(user.getId(), postId)) {
            throw new BadRequestException("已经收藏过该文章");
        }

        Favorite favorite = new Favorite();
        favorite.setUser(user);
        favorite.setPost(post);
        favoriteRepository.save(favorite);
    }

    /**
     * 取消收藏
     */
    @Transactional
    public void unfavoritePost(Long postId, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("用户不存在"));

        if (!favoriteRepository.existsByUserIdAndPostId(user.getId(), postId)) {
            throw new BadRequestException("尚未收藏该文章");
        }

        favoriteRepository.deleteByUserIdAndPostId(user.getId(), postId);
    }

    /**
     * 获取用户的收藏列表
     */
    @Transactional(readOnly = true)
    public Page<PostDTO> getUserFavorites(String username, Pageable pageable) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("用户不存在"));

        Page<Favorite> favorites = favoriteRepository.findByUserId(user.getId(), pageable);

        return favorites.map(favorite -> {
            Post post = favorite.getPost();
            return postService.convertToDTO(post);
        });
    }

    /**
     * 检查用户是否收藏了指定文章
     */
    @Transactional(readOnly = true)
    public boolean isFavorited(Long postId, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("用户不存在"));

        return favoriteRepository.existsByUserIdAndPostId(user.getId(), postId);
    }

    /**
     * 获取文章的收藏数
     */
    @Transactional(readOnly = true)
    public Long getFavoriteCount(Long postId) {
        return favoriteRepository.countByPostId(postId);
    }

    /**
     * 获取用户的收藏总数
     */
    @Transactional(readOnly = true)
    public Long getUserFavoriteCount(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("用户不存在"));

        return favoriteRepository.countByUserId(user.getId());
    }
}

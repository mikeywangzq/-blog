package com.blog.service;

import com.blog.dto.UpdateProfileRequest;
import com.blog.dto.UserProfileDTO;
import com.blog.exception.BadRequestException;
import com.blog.exception.ResourceNotFoundException;
import com.blog.model.User;
import com.blog.repository.FavoriteRepository;
import com.blog.repository.PostRepository;
import com.blog.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 用户服务类
 *
 * 功能：
 * - 用户个人资料管理
 * - 用户统计数据
 * - 头像上传
 */
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final FavoriteRepository favoriteRepository;

    /**
     * 获取用户个人资料（含统计数据）
     */
    @Transactional(readOnly = true)
    public UserProfileDTO getUserProfile(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("用户不存在"));

        UserProfileDTO dto = new UserProfileDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setNickname(user.getNickname());
        dto.setAvatar(user.getAvatar());
        dto.setBio(user.getBio());
        dto.setRole(user.getRole().name());
        dto.setCreatedAt(user.getCreatedAt());

        // 统计数据
        dto.setPostCount(postRepository.countByAuthorId(user.getId()));
        dto.setPublishedPostCount(postRepository.countByAuthorIdAndPublishedTrue(user.getId()));
        dto.setFavoriteCount(favoriteRepository.countByUserId(user.getId()));

        // TODO: 计算总浏览量（需要遍历所有文章求和）
        dto.setTotalViews(0L);

        return dto;
    }

    /**
     * 更新用户个人资料
     */
    @Transactional
    public UserProfileDTO updateProfile(String username, UpdateProfileRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("用户不存在"));

        // 更新昵称
        if (request.getNickname() != null) {
            user.setNickname(request.getNickname());
        }

        // 更新邮箱（需要检查是否已被使用）
        if (request.getEmail() != null && !request.getEmail().equals(user.getEmail())) {
            if (userRepository.existsByEmail(request.getEmail())) {
                throw new BadRequestException("该邮箱已被使用");
            }
            user.setEmail(request.getEmail());
        }

        // 更新简介
        if (request.getBio() != null) {
            user.setBio(request.getBio());
        }

        // 更新头像
        if (request.getAvatar() != null) {
            user.setAvatar(request.getAvatar());
        }

        userRepository.save(user);

        return getUserProfile(username);
    }
}

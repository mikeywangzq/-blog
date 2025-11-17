package com.blog.service;

import com.blog.dto.TagDTO;
import com.blog.model.Tag;
import com.blog.repository.TagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 标签服务类
 *
 * 功能：
 * - 标签的创建、查询、更新
 * - 标签使用次数统计
 * - 标签云数据生成
 */
@Service
@RequiredArgsConstructor
public class TagService {

    private final TagRepository tagRepository;

    /**
     * 获取所有标签
     */
    @Transactional(readOnly = true)
    public List<TagDTO> getAllTags() {
        return tagRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * 获取热门标签（标签云）
     */
    @Transactional(readOnly = true)
    public List<TagDTO> getPopularTags() {
        return tagRepository.findTop20ByOrderByUseCountDesc().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * 搜索标签（自动补全）
     */
    @Transactional(readOnly = true)
    public List<TagDTO> searchTags(String keyword) {
        return tagRepository.searchByName(keyword).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * 根据名称查找或创建标签
     * 如果标签不存在则创建，存在则返回
     */
    @Transactional
    public Tag findOrCreateTag(String name) {
        return tagRepository.findByName(name)
                .orElseGet(() -> {
                    Tag tag = new Tag();
                    tag.setName(name);
                    tag.setUseCount(0);
                    return tagRepository.save(tag);
                });
    }

    /**
     * 增加标签使用次数
     */
    @Transactional
    public void incrementUseCount(Long tagId) {
        tagRepository.findById(tagId).ifPresent(tag -> {
            tag.setUseCount(tag.getUseCount() + 1);
            tagRepository.save(tag);
        });
    }

    /**
     * 减少标签使用次数
     */
    @Transactional
    public void decrementUseCount(Long tagId) {
        tagRepository.findById(tagId).ifPresent(tag -> {
            int newCount = Math.max(0, tag.getUseCount() - 1);
            tag.setUseCount(newCount);
            tagRepository.save(tag);
        });
    }

    /**
     * 转换为DTO
     */
    private TagDTO convertToDTO(Tag tag) {
        return new TagDTO(tag.getId(), tag.getName(), tag.getUseCount());
    }
}

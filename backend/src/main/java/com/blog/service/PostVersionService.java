package com.blog.service;

import com.blog.model.Post;
import com.blog.model.PostVersion;
import com.blog.repository.PostVersionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * 文章版本服务
 * 管理文章的版本历史
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class PostVersionService {

    private final PostVersionRepository postVersionRepository;

    /**
     * 保存文章版本
     * @param post 文章对象
     * @param changeNote 修改备注
     * @return 保存的版本对象
     */
    @Transactional
    public PostVersion saveVersion(Post post, String changeNote) {
        try {
            // 获取最新版本号
            Integer latestVersion = postVersionRepository.findLatestVersionNumber(post.getId());
            int newVersion = (latestVersion == null ? 0 : latestVersion) + 1;

            // 创建新版本
            PostVersion version = new PostVersion(post, newVersion, changeNote);
            PostVersion saved = postVersionRepository.save(version);

            log.info("保存文章版本成功 - 文章ID: {}, 版本号: {}", post.getId(), newVersion);
            return saved;

        } catch (Exception e) {
            log.error("保存文章版本失败 - 文章ID: {}", post.getId(), e);
            throw new RuntimeException("保存文章版本失败: " + e.getMessage(), e);
        }
    }

    /**
     * 获取文章的所有版本历史
     * @param postId 文章ID
     * @return 版本列表（按版本号降序）
     */
    @Transactional(readOnly = true)
    public List<PostVersion> getVersionHistory(Long postId) {
        return postVersionRepository.findByPostIdOrderByVersionDesc(postId);
    }

    /**
     * 分页获取文章的版本历史
     * @param postId 文章ID
     * @param pageable 分页参数
     * @return 版本分页列表
     */
    @Transactional(readOnly = true)
    public Page<PostVersion> getVersionHistoryPage(Long postId, Pageable pageable) {
        return postVersionRepository.findByPostIdOrderByVersionDesc(postId, pageable);
    }

    /**
     * 获取指定版本
     * @param postId 文章ID
     * @param version 版本号
     * @return 版本对象
     */
    @Transactional(readOnly = true)
    public Optional<PostVersion> getVersion(Long postId, Integer version) {
        return postVersionRepository.findByPostIdAndVersion(postId, version);
    }

    /**
     * 获取文章的版本数量
     * @param postId 文章ID
     * @return 版本数量
     */
    @Transactional(readOnly = true)
    public Long getVersionCount(Long postId) {
        return postVersionRepository.countByPostId(postId);
    }

    /**
     * 比较两个版本的差异
     * @param postId 文章ID
     * @param version1 版本1
     * @param version2 版本2
     * @return 版本对比结果
     */
    @Transactional(readOnly = true)
    public VersionComparison compareVersions(Long postId, Integer version1, Integer version2) {
        Optional<PostVersion> v1Opt = postVersionRepository.findByPostIdAndVersion(postId, version1);
        Optional<PostVersion> v2Opt = postVersionRepository.findByPostIdAndVersion(postId, version2);

        if (v1Opt.isEmpty() || v2Opt.isEmpty()) {
            throw new IllegalArgumentException("版本不存在");
        }

        PostVersion v1 = v1Opt.get();
        PostVersion v2 = v2Opt.get();

        return new VersionComparison(
            v1,
            v2,
            !v1.getTitle().equals(v2.getTitle()),
            !v1.getContent().equals(v2.getContent()),
            !isSame(v1.getSummary(), v2.getSummary()),
            !isSame(v1.getTags(), v2.getTags())
        );
    }

    /**
     * 删除文章的所有版本历史
     * @param postId 文章ID
     */
    @Transactional
    public void deleteVersionHistory(Long postId) {
        try {
            postVersionRepository.deleteByPostId(postId);
            log.info("删除文章版本历史成功 - 文章ID: {}", postId);
        } catch (Exception e) {
            log.error("删除文章版本历史失败 - 文章ID: {}", postId, e);
            throw new RuntimeException("删除文章版本历史失败: " + e.getMessage(), e);
        }
    }

    /**
     * 辅助方法：比较两个字符串是否相同（考虑null）
     */
    private boolean isSame(String s1, String s2) {
        if (s1 == null && s2 == null) return true;
        if (s1 == null || s2 == null) return false;
        return s1.equals(s2);
    }

    /**
     * 版本对比结果DTO
     */
    public record VersionComparison(
        PostVersion version1,
        PostVersion version2,
        boolean titleChanged,
        boolean contentChanged,
        boolean summaryChanged,
        boolean tagsChanged
    ) {
        public boolean hasChanges() {
            return titleChanged || contentChanged || summaryChanged || tagsChanged;
        }
    }
}

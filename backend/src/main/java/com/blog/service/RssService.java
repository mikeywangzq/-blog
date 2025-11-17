package com.blog.service;

import com.blog.model.Post;
import com.blog.repository.PostRepository;
import com.rometools.rome.feed.synd.*;
import com.rometools.rome.io.SyndFeedOutput;
import com.rometools.rome.io.FeedException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * RSS订阅服务
 * 生成符合RSS 2.0规范的订阅源
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class RssService {

    private final PostRepository postRepository;

    @Value("${blog.site.url:http://localhost:3000}")
    private String siteUrl;

    @Value("${blog.site.name:个人博客}")
    private String siteName;

    @Value("${blog.site.description:分享技术与生活}")
    private String siteDescription;

    @Value("${blog.rss.max-items:20}")
    private int maxItems;

    /**
     * 生成RSS Feed XML字符串
     * @return RSS XML内容
     */
    @Transactional(readOnly = true)
    public String generateRssFeed() {
        try {
            // 创建SyndFeed对象
            SyndFeed feed = new SyndFeedImpl();
            feed.setFeedType("rss_2.0");
            feed.setTitle(siteName);
            feed.setLink(siteUrl);
            feed.setDescription(siteDescription);
            feed.setLanguage("zh-CN");
            feed.setPublishedDate(new Date());

            // 获取最新发布的文章
            PageRequest pageRequest = PageRequest.of(0, maxItems,
                Sort.by(Sort.Direction.DESC, "createdAt"));
            List<Post> posts = postRepository.findByPublishedTrue(pageRequest).getContent();

            // 转换为RSS条目
            List<SyndEntry> entries = new ArrayList<>();
            for (Post post : posts) {
                SyndEntry entry = new SyndEntryImpl();
                entry.setTitle(post.getTitle());
                entry.setLink(siteUrl + "/posts/" + post.getId());
                entry.setPublishedDate(Date.from(
                    post.getCreatedAt().atZone(ZoneId.systemDefault()).toInstant()
                ));
                entry.setUpdatedDate(Date.from(
                    post.getUpdatedAt().atZone(ZoneId.systemDefault()).toInstant()
                ));

                // 设置作者
                if (post.getAuthor() != null) {
                    entry.setAuthor(post.getAuthor().getUsername());
                }

                // 设置内容描述
                SyndContent description = new SyndContentImpl();
                description.setType("text/html");

                // 优先使用摘要，如果没有则使用内容的前200个字符
                String contentText;
                if (post.getSummary() != null && !post.getSummary().isEmpty()) {
                    contentText = post.getSummary();
                } else if (post.getContent() != null) {
                    contentText = post.getContent().length() > 200
                        ? post.getContent().substring(0, 200) + "..."
                        : post.getContent();
                } else {
                    contentText = "";
                }
                description.setValue(contentText);
                entry.setDescription(description);

                // 添加分类标签
                if (post.getCategory() != null) {
                    SyndCategory category = new SyndCategoryImpl();
                    category.setName(post.getCategory().getName());
                    List<SyndCategory> categories = new ArrayList<>();
                    categories.add(category);
                    entry.setCategories(categories);
                }

                entries.add(entry);
            }

            feed.setEntries(entries);

            // 生成XML字符串
            SyndFeedOutput output = new SyndFeedOutput();
            return output.outputString(feed);

        } catch (FeedException e) {
            log.error("生成RSS Feed失败", e);
            throw new RuntimeException("生成RSS Feed失败: " + e.getMessage(), e);
        }
    }

    /**
     * 生成分类RSS Feed
     * @param categoryId 分类ID
     * @return RSS XML内容
     */
    @Transactional(readOnly = true)
    public String generateCategoryRssFeed(Long categoryId) {
        try {
            SyndFeed feed = new SyndFeedImpl();
            feed.setFeedType("rss_2.0");
            feed.setTitle(siteName + " - 分类订阅");
            feed.setLink(siteUrl);
            feed.setDescription(siteDescription);
            feed.setLanguage("zh-CN");
            feed.setPublishedDate(new Date());

            // 获取指定分类的最新文章
            PageRequest pageRequest = PageRequest.of(0, maxItems,
                Sort.by(Sort.Direction.DESC, "createdAt"));
            List<Post> posts = postRepository.findByCategoryIdAndPublishedTrue(
                categoryId, pageRequest
            ).getContent();

            // 转换为RSS条目（代码与上面类似）
            List<SyndEntry> entries = new ArrayList<>();
            for (Post post : posts) {
                SyndEntry entry = new SyndEntryImpl();
                entry.setTitle(post.getTitle());
                entry.setLink(siteUrl + "/posts/" + post.getId());
                entry.setPublishedDate(Date.from(
                    post.getCreatedAt().atZone(ZoneId.systemDefault()).toInstant()
                ));

                if (post.getAuthor() != null) {
                    entry.setAuthor(post.getAuthor().getUsername());
                }

                SyndContent description = new SyndContentImpl();
                description.setType("text/html");
                String contentText = post.getSummary() != null && !post.getSummary().isEmpty()
                    ? post.getSummary()
                    : (post.getContent() != null && post.getContent().length() > 200
                        ? post.getContent().substring(0, 200) + "..."
                        : post.getContent());
                description.setValue(contentText);
                entry.setDescription(description);

                entries.add(entry);
            }

            feed.setEntries(entries);

            SyndFeedOutput output = new SyndFeedOutput();
            return output.outputString(feed);

        } catch (FeedException e) {
            log.error("生成分类RSS Feed失败", e);
            throw new RuntimeException("生成分类RSS Feed失败: " + e.getMessage(), e);
        }
    }
}

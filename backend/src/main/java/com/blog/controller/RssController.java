package com.blog.controller;

import com.blog.service.RssService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * RSS订阅控制器
 * 提供RSS Feed订阅端点
 */
@RestController
@RequestMapping("/rss")
@RequiredArgsConstructor
@Tag(name = "RSS订阅", description = "RSS Feed订阅接口")
public class RssController {

    private final RssService rssService;

    /**
     * 获取全站RSS订阅源
     * @return RSS XML内容
     */
    @GetMapping(value = "/feed.xml", produces = MediaType.APPLICATION_XML_VALUE)
    @Operation(summary = "获取全站RSS订阅源", description = "返回最新发布的文章RSS Feed")
    public ResponseEntity<String> getRssFeed() {
        String rssXml = rssService.generateRssFeed();
        return ResponseEntity.ok()
            .contentType(MediaType.APPLICATION_XML)
            .header("Cache-Control", "max-age=3600") // 缓存1小时
            .body(rssXml);
    }

    /**
     * 获取指定分类的RSS订阅源
     * @param categoryId 分类ID
     * @return RSS XML内容
     */
    @GetMapping(value = "/category/{categoryId}.xml", produces = MediaType.APPLICATION_XML_VALUE)
    @Operation(summary = "获取分类RSS订阅源", description = "返回指定分类的文章RSS Feed")
    public ResponseEntity<String> getCategoryRssFeed(@PathVariable Long categoryId) {
        String rssXml = rssService.generateCategoryRssFeed(categoryId);
        return ResponseEntity.ok()
            .contentType(MediaType.APPLICATION_XML)
            .header("Cache-Control", "max-age=3600") // 缓存1小时
            .body(rssXml);
    }

    /**
     * 获取RSS订阅信息（JSON格式，用于前端展示）
     * @return RSS订阅信息
     */
    @GetMapping("/info")
    @Operation(summary = "获取RSS订阅信息", description = "返回RSS订阅的相关信息")
    public ResponseEntity<?> getRssInfo() {
        return ResponseEntity.ok(new RssInfo(
            "/rss/feed.xml",
            "全站RSS订阅",
            "订阅获取最新文章更新"
        ));
    }

    /**
     * RSS订阅信息DTO
     */
    private record RssInfo(
        String feedUrl,
        String title,
        String description
    ) {}
}

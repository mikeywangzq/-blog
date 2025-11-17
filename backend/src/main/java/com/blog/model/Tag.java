package com.blog.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

/**
 * 标签实体
 *
 * 功能：
 * - 文章标签管理
 * - 与文章形成多对多关系
 * - 记录标签使用次数
 */
@Entity
@Table(name = "tags", indexes = {
    @Index(name = "idx_name", columnList = "name"),
    @Index(name = "idx_use_count", columnList = "useCount")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Tag {

    /** 标签ID */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** 标签名称（唯一） */
    @Column(nullable = false, unique = true, length = 50)
    private String name;

    /** 标签使用次数（关联的文章数量） */
    @Column(nullable = false)
    private Integer useCount = 0;

    /** 关联的文章集合 */
    @ManyToMany(mappedBy = "tags", fetch = FetchType.LAZY)
    private Set<Post> posts = new HashSet<>();
}

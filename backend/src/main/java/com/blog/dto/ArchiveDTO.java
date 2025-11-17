package com.blog.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 归档数据传输对象
 * 按年月分组的文章统计
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ArchiveDTO {
    /**
     * 年份
     */
    private Integer year;

    /**
     * 月份（1-12）
     */
    private Integer month;

    /**
     * 该月的文章数量
     */
    private Long count;

    /**
     * 格式化的归档名称（如：2024年1月）
     */
    private String archiveName;

    public ArchiveDTO(Integer year, Integer month, Long count) {
        this.year = year;
        this.month = month;
        this.count = count;
        this.archiveName = year + "年" + month + "月";
    }
}

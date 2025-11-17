import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { tagService } from '../services/tagService';

/**
 * 标签云组件
 *
 * 功能：
 * - 显示热门标签
 * - 标签大小根据使用次数动态调整
 * - 点击标签可筛选相关文章
 */
const TagCloud = () => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadTags();
  }, []);

  const loadTags = async () => {
    try {
      setLoading(true);
      const data = await tagService.getPopularTags();
      setTags(data);
    } catch (error) {
      console.error('加载标签失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTagClick = (tagId, tagName) => {
    navigate(`/tags/${tagId}?name=${encodeURIComponent(tagName)}`);
  };

  const getFontSize = (useCount) => {
    if (!tags.length) return '1rem';
    const maxCount = Math.max(...tags.map(t => t.useCount));
    const minCount = Math.min(...tags.map(t => t.useCount));
    const range = maxCount - minCount || 1;
    const normalized = (useCount - minCount) / range;
    const fontSize = 0.875 + normalized * 1.125; // 0.875rem ~ 2rem
    return `${fontSize}rem`;
  };

  const getColor = (index) => {
    const colors = [
      '#007bff', '#28a745', '#dc3545', '#ffc107', '#17a2b8',
      '#6f42c1', '#e83e8c', '#fd7e14', '#20c997', '#6c757d'
    ];
    return colors[index % colors.length];
  };

  if (loading) {
    return <div>加载标签中...</div>;
  }

  if (tags.length === 0) {
    return <div className="text-muted">暂无标签</div>;
  }

  return (
    <div className="tag-cloud" style={{ lineHeight: '2.5' }}>
      {tags.map((tag, index) => (
        <span
          key={tag.id}
          onClick={() => handleTagClick(tag.id, tag.name)}
          style={{
            fontSize: getFontSize(tag.useCount),
            color: getColor(index),
            cursor: 'pointer',
            margin: '0 0.5rem',
            display: 'inline-block',
            transition: 'all 0.2s',
          }}
          className="tag-item"
          title={`${tag.useCount} 篇文章`}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.1)';
            e.target.style.fontWeight = 'bold';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.fontWeight = 'normal';
          }}
        >
          #{tag.name}
        </span>
      ))}
    </div>
  );
};

export default TagCloud;

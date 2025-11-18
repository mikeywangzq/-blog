import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate } from '../utils/formatDate';
import '../styles/PostCard.css';

/**
 * 文章卡片组件 - 现代化设计
 * 用于在列表页展示文章摘要信息
 */
const PostCard = ({ post }) => {
  return (
    <article className="post-card fade-in">
      {/* 封面图片 */}
      {post.coverImage && (
        <div className="post-card-image">
          <Link to={`/posts/${post.id}`}>
            <img
              src={post.coverImage}
              alt={post.title}
              loading="lazy"
            />
          </Link>
          <div className="post-card-overlay"></div>
        </div>
      )}

      {/* 卡片内容 */}
      <div className="post-card-content">
        {/* 分类标签 */}
        {post.categoryName && (
          <span className="post-category-badge">
            {post.categoryName}
          </span>
        )}

        {/* 标题 */}
        <h2 className="post-card-title">
          <Link to={`/posts/${post.id}`} className="post-title-link">
            {post.title}
          </Link>
        </h2>

        {/* 摘要 */}
        {post.summary && (
          <p className="post-card-summary">{post.summary}</p>
        )}

        {/* 元信息 */}
        <div className="post-card-meta">
          <div className="post-meta-left">
            <span className="post-author">
              <svg className="icon" viewBox="0 0 24 24" width="16" height="16">
                <path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
              {post.authorName}
            </span>
            <span className="post-date">
              <svg className="icon" viewBox="0 0 24 24" width="16" height="16">
                <path fill="currentColor" d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
              </svg>
              {formatDate(post.createdAt)}
            </span>
          </div>

          <div className="post-meta-stats">
            <span className="post-stat">
              <svg className="icon" viewBox="0 0 24 24" width="16" height="16">
                <path fill="currentColor" d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
              </svg>
              {post.views}
            </span>
            {post.commentCount !== undefined && (
              <span className="post-stat">
                <svg className="icon" viewBox="0 0 24 24" width="16" height="16">
                  <path fill="currentColor" d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM18 14H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
                </svg>
                {post.commentCount}
              </span>
            )}
            {post.likeCount !== undefined && (
              <span className="post-stat">
                <svg className="icon" viewBox="0 0 24 24" width="16" height="16">
                  <path fill="currentColor" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
                {post.likeCount}
              </span>
            )}
          </div>
        </div>

        {/* 标签 */}
        {post.tags && (
          <div className="post-card-tags">
            {post.tags.split(',').slice(0, 3).map((tag, index) => (
              <span key={index} className="post-tag">
                #{tag.trim()}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 阅读更多按钮 */}
      <div className="post-card-footer">
        <Link to={`/posts/${post.id}`} className="read-more-link">
          <span>阅读全文</span>
          <svg className="arrow-icon" viewBox="0 0 24 24" width="18" height="18">
            <path fill="currentColor" d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
          </svg>
        </Link>
      </div>
    </article>
  );
};

export default PostCard;

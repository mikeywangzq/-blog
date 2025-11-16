import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate } from '../utils/formatDate';

const PostCard = ({ post }) => {
  return (
    <div className="post-card">
      <h2>
        <Link to={`/posts/${post.id}`}>{post.title}</Link>
      </h2>
      <div className="post-meta">
        <span>作者: {post.authorName}</span>
        {post.categoryName && <span> · 分类: {post.categoryName}</span>}
        <span> · {formatDate(post.createdAt)}</span>
        <span> · 浏览: {post.views}</span>
        {post.commentCount !== undefined && <span> · 评论: {post.commentCount}</span>}
        {post.likeCount !== undefined && <span> · 点赞: {post.likeCount}</span>}
      </div>
      {post.summary && (
        <p className="post-summary">{post.summary}</p>
      )}
    </div>
  );
};

export default PostCard;

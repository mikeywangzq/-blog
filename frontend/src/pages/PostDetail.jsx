import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { postService } from '../services/postService';
import { authService } from '../services/authService';
import { formatDate } from '../utils/formatDate';
import CommentSection from '../components/CommentSection';
import LikeButton from '../components/LikeButton';
import FavoriteButton from '../components/FavoriteButton';
import TableOfContents from '../components/TableOfContents';
import ShareButtons from '../components/ShareButtons';
import VersionHistory from '../components/VersionHistory';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const user = authService.getCurrentUser();

  useEffect(() => {
    loadPost();
  }, [id]);

  const loadPost = async () => {
    try {
      setLoading(true);
      const data = await postService.getPostById(id);
      setPost(data);
    } catch (error) {
      console.error('加载文章失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('确定要删除这篇文章吗？')) {
      try {
        await postService.deletePost(id);
        navigate('/');
      } catch (error) {
        console.error('删除文章失败:', error);
        alert('删除失败');
      }
    }
  };

  if (loading) {
    return <div className="loading">加载中...</div>;
  }

  if (!post) {
    return <div className="container">文章不存在</div>;
  }

  return (
    <div className="container mt-4">
      <div className="row">
        {/* 主内容区域 */}
        <div className="col-lg-9">
          <div className="post-detail">
            <h1>{post.title}</h1>
            <div className="post-meta">
              <span>作者: {post.authorName}</span>
              {post.categoryName && <span> · 分类: {post.categoryName}</span>}
              <span> · {formatDate(post.createdAt)}</span>
              <span> · 浏览: {post.views}</span>
            </div>

            {user && user.id === post.authorId && (
              <div style={{ marginTop: '1rem' }}>
                <button
                  onClick={() => navigate(`/edit-post/${post.id}`)}
                  className="btn btn-primary"
                  style={{ marginRight: '1rem' }}
                >
                  编辑
                </button>
                <button
                  onClick={() => setShowVersionHistory(!showVersionHistory)}
                  className="btn btn-secondary"
                  style={{ marginRight: '1rem' }}
                >
                  {showVersionHistory ? '隐藏版本历史' : '查看版本历史'}
                </button>
                <button onClick={handleDelete} className="btn btn-danger">
                  删除
                </button>
              </div>
            )}

            {showVersionHistory && user && user.id === post.authorId && (
              <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--bg-secondary, #f8f9fa)', borderRadius: '8px' }}>
                <VersionHistory postId={post.id} />
              </div>
            )}

            <div className="post-content markdown-preview" style={{ marginTop: '2rem' }}>
              <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>

            {post.tags && (
              <div style={{ marginTop: '2rem' }}>
                <strong>标签: </strong>
                {post.tags.split(',').map((tag, index) => (
                  <span key={index} className="badge bg-info ms-1">
                    {tag.trim()}
                  </span>
                ))}
              </div>
            )}

            <div style={{ marginTop: '2rem', padding: '1rem 0', borderTop: '1px solid #eee', display: 'flex', gap: '1rem' }}>
              <LikeButton postId={post.id} />
              <FavoriteButton postId={post.id} />
            </div>

            <ShareButtons
              title={post.title}
              url={window.location.href}
              summary={post.summary}
            />

            <CommentSection postId={post.id} />
          </div>
        </div>

        {/* 右侧目录 */}
        <div className="col-lg-3 d-none d-lg-block">
          <TableOfContents content={post.content} />
        </div>
      </div>
    </div>
  );
};

export default PostDetail;

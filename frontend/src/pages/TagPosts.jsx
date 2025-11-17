import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { tagService } from '../services/tagService';
import { formatDate } from '../utils/formatDate';

/**
 * 标签文章列表页面
 *
 * 功能：
 * - 根据标签ID显示相关文章
 * - 支持分页
 * - 显示标签名称
 */
const TagPosts = () => {
  const { tagId } = useParams();
  const [searchParams] = useSearchParams();
  const tagName = searchParams.get('name') || '标签';
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    loadPosts();
  }, [tagId, currentPage]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const data = await tagService.getPostsByTag(tagId, currentPage, 10);
      setPosts(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('加载文章失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostClick = (postId) => {
    navigate(`/posts/${postId}`);
  };

  if (loading) {
    return <div className="container mt-5"><div>加载中...</div></div>;
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4">
        标签: <span className="badge bg-primary">#{tagName}</span>
      </h2>

      {posts.length === 0 ? (
        <div className="alert alert-info">
          <p className="mb-0">该标签下暂无文章</p>
        </div>
      ) : (
        <>
          <div className="row">
            {posts.map((post) => (
              <div key={post.id} className="col-md-6 mb-4">
                <div className="card h-100" style={{ cursor: 'pointer' }}>
                  {post.coverImage && (
                    <img
                      src={post.coverImage}
                      className="card-img-top"
                      alt={post.title}
                      style={{ height: '200px', objectFit: 'cover' }}
                      onClick={() => handlePostClick(post.id)}
                    />
                  )}
                  <div className="card-body" onClick={() => handlePostClick(post.id)}>
                    <h5 className="card-title">{post.title}</h5>
                    <p className="card-text text-muted">{post.summary}</p>
                    <div className="d-flex justify-content-between align-items-center">
                      <small className="text-muted">
                        {post.authorName} • {formatDate(post.createdAt)}
                      </small>
                      <div>
                        <span className="badge bg-secondary me-1">
                          {post.views} 浏览
                        </span>
                        <span className="badge bg-info me-1">
                          {post.likeCount} 点赞
                        </span>
                        <span className="badge bg-success">
                          {post.commentCount} 评论
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 分页 */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-4">
              <nav>
                <ul className="pagination">
                  <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 0}
                    >
                      上一页
                    </button>
                  </li>
                  <li className="page-item disabled">
                    <span className="page-link">
                      {currentPage + 1} / {totalPages}
                    </span>
                  </li>
                  <li className={`page-item ${currentPage === totalPages - 1 ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages - 1}
                    >
                      下一页
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TagPosts;

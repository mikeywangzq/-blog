import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { favoriteService } from '../services/favoriteService';
import { formatDate } from '../utils/formatDate';

/**
 * 我的收藏页面
 *
 * 功能：
 * - 显示用户收藏的所有文章
 * - 支持分页
 * - 可以取消收藏
 * - 点击文章可跳转到详情页
 */
const MyFavorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    loadFavorites();
  }, [currentPage]);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const data = await favoriteService.getMyFavorites(currentPage, 10);
      setFavorites(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('加载收藏失败:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUnfavorite = async (postId) => {
    if (!window.confirm('确定要取消收藏这篇文章吗？')) return;

    try {
      await favoriteService.unfavoritePost(postId);
      loadFavorites();
    } catch (error) {
      console.error('取消收藏失败:', error);
      alert('操作失败，请重试');
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
      <h2 className="mb-4">我的收藏</h2>

      {favorites.length === 0 ? (
        <div className="alert alert-info">
          <p className="mb-0">暂无收藏，快去<a href="/">首页</a>找找感兴趣的文章吧！</p>
        </div>
      ) : (
        <>
          <div className="row">
            {favorites.map((post) => (
              <div key={post.id} className="col-md-6 mb-4">
                <div className="card h-100">
                  {post.coverImage && (
                    <img
                      src={post.coverImage}
                      className="card-img-top"
                      alt={post.title}
                      style={{
                        height: '200px',
                        objectFit: 'cover',
                        cursor: 'pointer'
                      }}
                      onClick={() => handlePostClick(post.id)}
                    />
                  )}
                  <div className="card-body">
                    <h5
                      className="card-title"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handlePostClick(post.id)}
                    >
                      {post.title}
                    </h5>
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
                  <div className="card-footer">
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleUnfavorite(post.id)}
                    >
                      取消收藏
                    </button>
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

export default MyFavorites;

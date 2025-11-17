import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { postService } from '../services/postService';
import { formatDate } from '../utils/formatDate';

/**
 * 草稿箱页面
 *
 * 功能：
 * - 显示用户的所有草稿文章
 * - 支持分页
 * - 可以编辑或删除草稿
 * - 显示草稿的最后更新时间
 */
const DraftsPage = () => {
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    loadDrafts();
  }, [currentPage]);

  const loadDrafts = async () => {
    try {
      setLoading(true);
      const data = await postService.getMyDrafts(currentPage, 10);
      setDrafts(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('加载草稿失败:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (postId) => {
    navigate(`/edit-post/${postId}`);
  };

  const handleDelete = async (postId) => {
    if (!window.confirm('确定要删除这篇草稿吗？')) return;

    try {
      await postService.deletePost(postId);
      loadDrafts();
    } catch (error) {
      console.error('删除草稿失败:', error);
      alert('删除失败，请重试');
    }
  };

  if (loading) {
    return <div className="container mt-5"><div>加载中...</div></div>;
  }

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>我的草稿</h2>
        <button
          className="btn btn-primary"
          onClick={() => navigate('/create-post')}
        >
          写新文章
        </button>
      </div>

      {drafts.length === 0 ? (
        <div className="alert alert-info">
          <p className="mb-0">暂无草稿，<a href="/create-post">点击这里</a>开始写作吧！</p>
        </div>
      ) : (
        <>
          <div className="list-group">
            {drafts.map((draft) => (
              <div
                key={draft.id}
                className="list-group-item list-group-item-action"
              >
                <div className="d-flex w-100 justify-content-between align-items-start">
                  <div className="flex-grow-1">
                    <h5 className="mb-1">
                      {draft.title || '无标题'}
                    </h5>
                    <p className="mb-1 text-muted">
                      {draft.summary || '暂无摘要'}
                    </p>
                    <small className="text-muted">
                      最后更新: {formatDate(draft.updatedAt)}
                      {draft.categoryName && (
                        <span className="ms-3">
                          分类: <span className="badge bg-secondary">{draft.categoryName}</span>
                        </span>
                      )}
                      {draft.tags && draft.tags.length > 0 && (
                        <span className="ms-3">
                          标签: {draft.tags.split(',').map(tag => (
                            <span key={tag} className="badge bg-info ms-1">{tag.trim()}</span>
                          ))}
                        </span>
                      )}
                    </small>
                  </div>
                  <div className="ms-3">
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => handleEdit(draft.id)}
                    >
                      编辑
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(draft.id)}
                    >
                      删除
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

export default DraftsPage;

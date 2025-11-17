import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { archiveService } from '../services/archiveService';
import PostCard from '../components/PostCard';
import Pagination from '../components/Pagination';

/**
 * 归档页面
 * 显示指定年月的文章列表
 */
const ArchivePage = () => {
  const { year, month } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    loadPosts();
  }, [year, month, currentPage]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const data = await archiveService.getPostsByYearMonth(
        parseInt(year),
        parseInt(month),
        currentPage,
        10
      );
      setPosts(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('加载归档文章失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  if (loading) {
    return <div className="container mt-5"><div>加载中...</div></div>;
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4">
        📅 归档: {year}年{month}月
        <span className="badge bg-secondary ms-2">{posts.length}篇</span>
      </h2>

      {posts.length === 0 ? (
        <div className="alert alert-info">
          <p className="mb-0">该月份暂无文章</p>
        </div>
      ) : (
        <>
          <div className="post-list">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}

      <div className="mt-4">
        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate('/')}
        >
          ← 返回首页
        </button>
      </div>
    </div>
  );
};

export default ArchivePage;

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { postService } from '../services/postService';
import PostCard from '../components/PostCard';
import Pagination from '../components/Pagination';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [recentPosts, setRecentPosts] = useState([]);

  useEffect(() => {
    loadPosts();
    loadRecentPosts();
  }, [currentPage]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const data = await postService.getPosts(currentPage, 10);
      setPosts(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('加载文章失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRecentPosts = async () => {
    try {
      const data = await postService.getRecentPosts();
      setRecentPosts(data);
    } catch (error) {
      console.error('加载最新文章失败:', error);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  if (loading) {
    return <div className="loading">加载中...</div>;
  }

  return (
    <div className="container" style={{ marginTop: '2rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        <div>
          <h1>最新文章</h1>
          <div className="post-list">
            {posts.length === 0 ? (
              <p>暂无文章</p>
            ) : (
              posts.map((post) => <PostCard key={post.id} post={post} />)
            )}
          </div>
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>

        <aside>
          <div className="sidebar">
            <h3>最新文章</h3>
            <ul>
              {recentPosts.map((post) => (
                <li key={post.id}>
                  <Link to={`/posts/${post.id}`}>{post.title}</Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Home;

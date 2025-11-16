import React, { useEffect, useState } from 'react';
import { likeService } from '../services/likeService';
import { authService } from '../services/authService';

const LikeButton = ({ postId }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const isAuthenticated = authService.isAuthenticated();

  useEffect(() => {
    loadLikeStatus();
  }, [postId]);

  const loadLikeStatus = async () => {
    try {
      const count = await likeService.getLikeCount(postId);
      setLikeCount(count);

      if (isAuthenticated) {
        const status = await likeService.isLiked(postId);
        setLiked(status);
      }
    } catch (error) {
      console.error('加载点赞状态失败:', error);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      alert('请先登录');
      return;
    }

    if (loading) return;

    try {
      setLoading(true);
      if (liked) {
        await likeService.unlikePost(postId);
        setLiked(false);
        setLikeCount(likeCount - 1);
      } else {
        await likeService.likePost(postId);
        setLiked(true);
        setLikeCount(likeCount + 1);
      }
    } catch (error) {
      console.error('点赞操作失败:', error);
      alert(error.response?.data?.message || '操作失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={loading}
      style={{
        padding: '0.5rem 1rem',
        border: liked ? '2px solid #dc3545' : '2px solid #ddd',
        borderRadius: '20px',
        backgroundColor: liked ? '#fff' : '#fff',
        color: liked ? '#dc3545' : '#666',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontSize: '1rem',
        transition: 'all 0.3s',
      }}
    >
      <span style={{ fontSize: '1.2rem' }}>{liked ? '❤️' : '🤍'}</span>
      <span>{likeCount}</span>
    </button>
  );
};

export default LikeButton;

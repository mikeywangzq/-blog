import React, { useState, useEffect } from 'react';
import { favoriteService } from '../services/favoriteService';
import { authService } from '../services/authService';
import { useNavigate } from 'react-router-dom';

/**
 * 收藏按钮组件
 *
 * 功能：
 * - 显示收藏状态（已收藏/未收藏）
 * - 点击切换收藏状态
 * - 显示收藏数量
 * - 未登录时点击跳转到登录页
 */
const FavoriteButton = ({ postId }) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const isAuthenticated = authService.isAuthenticated();
  const navigate = useNavigate();

  useEffect(() => {
    loadFavoriteStatus();
    loadFavoriteCount();
  }, [postId]);

  const loadFavoriteStatus = async () => {
    if (!isAuthenticated) return;

    try {
      const status = await favoriteService.isFavorited(postId);
      setIsFavorited(status);
    } catch (error) {
      console.error('获取收藏状态失败:', error);
    }
  };

  const loadFavoriteCount = async () => {
    try {
      const count = await favoriteService.getFavoriteCount(postId);
      setFavoriteCount(count);
    } catch (error) {
      console.error('获取收藏数失败:', error);
    }
  };

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      if (window.confirm('请先登录后再收藏文章')) {
        navigate('/login');
      }
      return;
    }

    try {
      setLoading(true);
      if (isFavorited) {
        await favoriteService.unfavoritePost(postId);
        setIsFavorited(false);
        setFavoriteCount(prev => Math.max(0, prev - 1));
      } else {
        await favoriteService.favoritePost(postId);
        setIsFavorited(true);
        setFavoriteCount(prev => prev + 1);
      }
    } catch (error) {
      console.error('收藏操作失败:', error);
      alert(error.response?.data?.message || '操作失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggleFavorite}
      disabled={loading}
      className={`btn ${isFavorited ? 'btn-warning' : 'btn-outline-warning'}`}
      style={{ minWidth: '120px' }}
    >
      {loading ? (
        '处理中...'
      ) : (
        <>
          {isFavorited ? '★ 已收藏' : '☆ 收藏'}
          <span className="badge bg-secondary ms-2">{favoriteCount}</span>
        </>
      )}
    </button>
  );
};

export default FavoriteButton;

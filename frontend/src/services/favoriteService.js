import api from './api';

/**
 * 收藏服务
 * 提供文章收藏相关的API调用
 */
export const favoriteService = {
  /**
   * 收藏文章
   * @param {number} postId - 文章ID
   */
  favoritePost: async (postId) => {
    const response = await api.post(`/favorites/post/${postId}`);
    return response.data;
  },

  /**
   * 取消收藏
   * @param {number} postId - 文章ID
   */
  unfavoritePost: async (postId) => {
    const response = await api.delete(`/favorites/post/${postId}`);
    return response.data;
  },

  /**
   * 获取当前用户的收藏列表
   * @param {number} page - 页码
   * @param {number} size - 每页数量
   */
  getMyFavorites: async (page = 0, size = 10) => {
    const response = await api.get('/favorites', {
      params: { page, size }
    });
    return response.data;
  },

  /**
   * 检查是否已收藏某篇文章
   * @param {number} postId - 文章ID
   */
  isFavorited: async (postId) => {
    const response = await api.get(`/favorites/post/${postId}/status`);
    return response.data;
  },

  /**
   * 获取文章的收藏数
   * @param {number} postId - 文章ID
   */
  getFavoriteCount: async (postId) => {
    const response = await api.get(`/favorites/post/${postId}/count`);
    return response.data;
  }
};

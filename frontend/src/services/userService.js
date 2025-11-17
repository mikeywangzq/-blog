import api from './api';

/**
 * 用户服务
 * 提供用户个人中心相关的API调用
 */
export const userService = {
  /**
   * 获取当前用户的个人资料和统计信息
   */
  getCurrentUserProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  /**
   * 根据用户名获取用户公开信息
   */
  getUserByUsername: async (username) => {
    const response = await api.get(`/users/${username}`);
    return response.data;
  },

  /**
   * 更新当前用户的个人资料
   * @param {Object} profileData - 包含 nickname, email, bio, avatar
   */
  updateProfile: async (profileData) => {
    const response = await api.put('/users/profile', profileData);
    return response.data;
  }
};

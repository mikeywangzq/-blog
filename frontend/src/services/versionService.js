import api from './api';

/**
 * 文章版本服务
 * 提供版本历史查询和对比功能
 */
export const versionService = {
  /**
   * 获取文章的版本历史
   * @param {number} postId - 文章ID
   * @returns {Promise<Array>} 版本列表
   */
  getVersionHistory: async (postId) => {
    const response = await api.get(`/posts/${postId}/versions`);
    return response.data;
  },

  /**
   * 分页获取文章的版本历史
   * @param {number} postId - 文章ID
   * @param {number} page - 页码
   * @param {number} size - 每页数量
   * @returns {Promise<Object>} 版本分页数据
   */
  getVersionHistoryPage: async (postId, page = 0, size = 10) => {
    const response = await api.get(`/posts/${postId}/versions/page`, {
      params: { page, size }
    });
    return response.data;
  },

  /**
   * 获取指定版本的内容
   * @param {number} postId - 文章ID
   * @param {number} version - 版本号
   * @returns {Promise<Object>} 版本详情
   */
  getVersion: async (postId, version) => {
    const response = await api.get(`/posts/${postId}/versions/${version}`);
    return response.data;
  },

  /**
   * 对比两个版本
   * @param {number} postId - 文章ID
   * @param {number} v1 - 版本1
   * @param {number} v2 - 版本2
   * @returns {Promise<Object>} 版本对比结果
   */
  compareVersions: async (postId, v1, v2) => {
    const response = await api.get(`/posts/${postId}/versions/compare`, {
      params: { v1, v2 }
    });
    return response.data;
  },

  /**
   * 获取版本统计信息
   * @param {number} postId - 文章ID
   * @returns {Promise<Object>} 版本统计
   */
  getVersionStats: async (postId) => {
    const response = await api.get(`/posts/${postId}/versions/stats`);
    return response.data;
  }
};

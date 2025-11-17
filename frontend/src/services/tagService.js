import api from './api';

/**
 * 标签服务
 * 提供标签相关的API调用
 */
export const tagService = {
  /**
   * 获取所有标签
   */
  getAllTags: async () => {
    const response = await api.get('/tags');
    return response.data;
  },

  /**
   * 获取热门标签（用于标签云）
   */
  getPopularTags: async () => {
    const response = await api.get('/tags/popular');
    return response.data;
  },

  /**
   * 搜索标签（用于自动完成）
   * @param {string} keyword - 搜索关键词
   */
  searchTags: async (keyword) => {
    const response = await api.get('/tags/search', {
      params: { keyword }
    });
    return response.data;
  },

  /**
   * 根据标签ID获取文章列表
   * @param {number} tagId - 标签ID
   * @param {number} page - 页码
   * @param {number} size - 每页数量
   */
  getPostsByTag: async (tagId, page = 0, size = 10) => {
    const response = await api.get(`/tags/${tagId}/posts`, {
      params: { page, size }
    });
    return response.data;
  }
};

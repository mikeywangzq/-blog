import api from './api';

/**
 * 归档服务
 * 提供文章归档相关的API调用
 */
export const archiveService = {
  /**
   * 获取归档统计（按年月分组）
   */
  getArchives: async () => {
    const response = await api.get('/posts/archives');
    return response.data;
  },

  /**
   * 获取指定年月的文章列表
   * @param {number} year - 年份
   * @param {number} month - 月份
   * @param {number} page - 页码
   * @param {number} size - 每页数量
   */
  getPostsByYearMonth: async (year, month, page = 0, size = 10) => {
    const response = await api.get(`/posts/archives/${year}/${month}`, {
      params: { page, size }
    });
    return response.data;
  }
};

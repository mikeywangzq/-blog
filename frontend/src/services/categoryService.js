import api from './api';

export const categoryService = {
  // 获取所有分类
  getCategories: async () => {
    const response = await api.get('/categories');
    return response.data;
  },

  // 获取分类详情
  getCategoryById: async (id) => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },

  // 创建分类
  createCategory: async (categoryData) => {
    const response = await api.post('/categories', categoryData);
    return response.data;
  },

  // 更新分类
  updateCategory: async (id, categoryData) => {
    const response = await api.put(`/categories/${id}`, categoryData);
    return response.data;
  },

  // 删除分类
  deleteCategory: async (id) => {
    await api.delete(`/categories/${id}`);
  },
};

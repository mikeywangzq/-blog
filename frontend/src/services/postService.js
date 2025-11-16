import api from './api';

export const postService = {
  // 获取文章列表（分页）
  getPosts: async (page = 0, size = 10, sortBy = 'createdAt', direction = 'DESC') => {
    const response = await api.get('/posts', {
      params: { page, size, sortBy, direction },
    });
    return response.data;
  },

  // 获取文章详情
  getPostById: async (id) => {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  },

  // 创建文章
  createPost: async (postData) => {
    const response = await api.post('/posts', postData);
    return response.data;
  },

  // 更新文章
  updatePost: async (id, postData) => {
    const response = await api.put(`/posts/${id}`, postData);
    return response.data;
  },

  // 删除文章
  deletePost: async (id) => {
    await api.delete(`/posts/${id}`);
  },

  // 搜索文章
  searchPosts: async (keyword, page = 0, size = 10) => {
    const response = await api.get('/posts/search', {
      params: { keyword, page, size },
    });
    return response.data;
  },

  // 获取热门文章
  getPopularPosts: async () => {
    const response = await api.get('/posts/popular');
    return response.data;
  },

  // 获取最新文章
  getRecentPosts: async () => {
    const response = await api.get('/posts/recent');
    return response.data;
  },
};

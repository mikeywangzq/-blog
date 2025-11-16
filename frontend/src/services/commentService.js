import api from './api';

export const commentService = {
  // 获取文章评论列表
  getCommentsByPostId: async (postId, page = 0, size = 20) => {
    const response = await api.get(`/comments/post/${postId}`, {
      params: { page, size },
    });
    return response.data;
  },

  // 创建评论
  createComment: async (commentData) => {
    const response = await api.post('/comments', commentData);
    return response.data;
  },

  // 删除评论
  deleteComment: async (id) => {
    await api.delete(`/comments/${id}`);
  },

  // 获取评论数量
  getCommentCount: async (postId) => {
    const response = await api.get(`/comments/post/${postId}/count`);
    return response.data;
  },
};

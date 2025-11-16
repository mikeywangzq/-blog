import api from './api';

export const likeService = {
  // 点赞文章
  likePost: async (postId) => {
    await api.post(`/likes/post/${postId}`);
  },

  // 取消点赞
  unlikePost: async (postId) => {
    await api.delete(`/likes/post/${postId}`);
  },

  // 获取点赞数
  getLikeCount: async (postId) => {
    const response = await api.get(`/likes/post/${postId}/count`);
    return response.data;
  },

  // 检查是否已点赞
  isLiked: async (postId) => {
    const response = await api.get(`/likes/post/${postId}/status`);
    return response.data;
  },
};

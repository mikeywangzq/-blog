import api from './api';

export const authService = {
  // 用户注册
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  // 用户登录
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  // 用户登出
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // 获取当前用户
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // 检查是否已登录
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};

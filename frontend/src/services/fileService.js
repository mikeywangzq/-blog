import api from './api';

/**
 * 文件上传服务
 *
 * 功能：
 * - 上传图片文件到服务器
 * - 返回上传后的文件访问URL
 *
 * 支持的格式：jpg, jpeg, png, gif, webp, bmp
 * 文件大小限制：5MB
 */
export const fileService = {
  /**
   * 上传图片文件
   *
   * @param {File} file - 要上传的文件对象
   * @returns {Promise<{url: string, filename: string}>} 上传后的文件URL和文件名
   *
   * 使用示例：
   * const file = event.target.files[0];
   * const result = await fileService.uploadImage(file);
   * console.log(result.url); // "/uploads/uuid.jpg"
   */
  uploadImage: async (file) => {
    // 创建FormData对象用于文件上传
    const formData = new FormData();
    formData.append('file', file);

    // 发送multipart/form-data请求
    const response = await api.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },
};

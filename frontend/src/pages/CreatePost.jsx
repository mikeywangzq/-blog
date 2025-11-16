import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { postService } from '../services/postService';
import { categoryService } from '../services/categoryService';

const CreatePost = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    summary: '',
    coverImage: '',
    categoryId: '',
    published: false,
    tags: '',
  });

  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCategories();
    if (isEdit) {
      loadPost();
    }
  }, [id]);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('加载分类失败:', error);
    }
  };

  const loadPost = async () => {
    try {
      const post = await postService.getPostById(id);
      setFormData({
        title: post.title,
        content: post.content,
        summary: post.summary || '',
        coverImage: post.coverImage || '',
        categoryId: post.categoryId || '',
        published: post.published,
        tags: post.tags || '',
      });
    } catch (error) {
      console.error('加载文章失败:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = {
        ...formData,
        categoryId: formData.categoryId ? parseInt(formData.categoryId) : null,
      };

      if (isEdit) {
        await postService.updatePost(id, data);
      } else {
        await postService.createPost(data);
      }

      navigate('/');
    } catch (error) {
      console.error('保存文章失败:', error);
      setError(error.response?.data?.message || '保存失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h1>{isEdit ? '编辑文章' : '创建新文章'}</h1>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>标题 *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="form-control"
            required
            maxLength={200}
          />
        </div>

        <div className="form-group">
          <label>内容 *</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            className="form-control"
            required
            rows={15}
          />
        </div>

        <div className="form-group">
          <label>摘要</label>
          <textarea
            name="summary"
            value={formData.summary}
            onChange={handleChange}
            className="form-control"
            maxLength={500}
            rows={3}
          />
        </div>

        <div className="form-group">
          <label>封面图片 URL</label>
          <input
            type="text"
            name="coverImage"
            value={formData.coverImage}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>分类</label>
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            className="form-control"
          >
            <option value="">请选择分类</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>标签（用逗号分隔）</label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            className="form-control"
            placeholder="例如: React, JavaScript, 前端"
          />
        </div>

        <div className="form-group">
          <label>
            <input
              type="checkbox"
              name="published"
              checked={formData.published}
              onChange={handleChange}
            />
            {' '}发布文章
          </label>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? '保存中...' : '保存'}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn btn-secondary"
          >
            取消
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;

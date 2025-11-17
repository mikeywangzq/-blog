import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { postService } from '../services/postService';
import { categoryService } from '../services/categoryService';
import { tagService } from '../services/tagService';
import MarkdownEditor from '../components/MarkdownEditor';
import { useAutoSave } from '../hooks/useAutoSave';

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
    changeNote: '',
  });

  const [categories, setCategories] = useState([]);
  const [suggestedTags, setSuggestedTags] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);

  // 自动保存函数
  const autoSavePost = useCallback(async (data) => {
    if (!data.title && !data.content) {
      return; // 空内容不保存
    }

    const saveData = {
      ...data,
      published: false, // 自动保存始终保存为草稿
      categoryId: data.categoryId ? parseInt(data.categoryId) : null,
    };

    try {
      if (isEdit) {
        await postService.updatePost(id, saveData);
      } else if (id) {
        // 如果已经创建了草稿，更新它
        await postService.updatePost(id, saveData);
      } else {
        // 创建新草稿
        const newPost = await postService.createPost(saveData);
        // 更新URL为编辑模式，但不刷新页面
        window.history.replaceState(null, '', `/edit-post/${newPost.id}`);
      }
    } catch (error) {
      console.error('自动保存失败:', error);
    }
  }, [isEdit, id]);

  // 使用自动保存hook
  const { lastSaved, isSaving } = useAutoSave(
    autoSavePost,
    autoSaveEnabled ? formData : null,
    30000 // 30秒自动保存一次
  );

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

  const handleChange = async (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });

    // 标签自动完成
    if (name === 'tags' && value) {
      const lastTag = value.split(',').pop().trim();
      if (lastTag.length >= 1) {
        try {
          const tags = await tagService.searchTags(lastTag);
          setSuggestedTags(tags);
          setShowSuggestions(true);
        } catch (error) {
          console.error('搜索标签失败:', error);
        }
      } else {
        setShowSuggestions(false);
      }
    }
  };

  const handleSubmit = async (e, shouldPublish = null) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = {
        ...formData,
        published: shouldPublish !== null ? shouldPublish : formData.published,
        categoryId: formData.categoryId ? parseInt(formData.categoryId) : null,
      };

      if (isEdit) {
        await postService.updatePost(id, data);
        // 清空修改备注
        setFormData(prev => ({ ...prev, changeNote: '' }));
      } else {
        await postService.createPost(data);
      }

      if (data.published) {
        navigate('/');
      } else {
        navigate('/my-drafts');
      }
    } catch (error) {
      console.error('保存文章失败:', error);
      setError(error.response?.data?.message || '保存失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleTagSelect = (tagName) => {
    const currentTags = formData.tags.split(',').map(t => t.trim()).filter(Boolean);
    currentTags[currentTags.length - 1] = tagName;
    setFormData({ ...formData, tags: currentTags.join(', ') + ', ' });
    setShowSuggestions(false);
  };

  return (
    <div className="form-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1>{isEdit ? '编辑文章' : '创建新文章'}</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            <input
              type="checkbox"
              checked={autoSaveEnabled}
              onChange={(e) => setAutoSaveEnabled(e.target.checked)}
              style={{ marginRight: '0.5rem' }}
            />
            自动保存
          </label>
          {isSaving && <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>保存中...</span>}
          {!isSaving && lastSaved && (
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              上次保存: {lastSaved.toLocaleTimeString('zh-CN')}
            </span>
          )}
        </div>
      </div>

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
          <label>内容 * (支持 Markdown)</label>
          <MarkdownEditor
            value={formData.content}
            onChange={(value) => setFormData({ ...formData, content: value })}
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

        <div className="form-group" style={{ position: 'relative' }}>
          <label>标签（用逗号分隔）</label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className="form-control"
            placeholder="例如: React, JavaScript, 前端"
          />
          {showSuggestions && suggestedTags.length > 0 && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                backgroundColor: 'white',
                border: '1px solid #ddd',
                borderRadius: '4px',
                maxHeight: '200px',
                overflowY: 'auto',
                zIndex: 1000,
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              }}
            >
              {suggestedTags.map((tag) => (
                <div
                  key={tag.id}
                  onClick={() => handleTagSelect(tag.name)}
                  style={{
                    padding: '0.5rem 1rem',
                    cursor: 'pointer',
                    borderBottom: '1px solid #eee',
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#f0f0f0'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                >
                  {tag.name} <small className="text-muted">({tag.useCount}篇)</small>
                </div>
              ))}
            </div>
          )}
        </div>

        {isEdit && (
          <div className="form-group">
            <label>修改备注（可选）</label>
            <input
              type="text"
              name="changeNote"
              value={formData.changeNote}
              onChange={handleChange}
              className="form-control"
              placeholder="简要说明本次修改内容..."
              maxLength={200}
            />
            <small className="form-text text-muted">
              记录本次修改的主要内容，方便后续查看版本历史
            </small>
          </div>
        )}

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <button
            type="button"
            onClick={(e) => handleSubmit(e, false)}
            className="btn btn-secondary"
            disabled={loading}
          >
            {loading ? '保存中...' : '保存为草稿'}
          </button>
          <button
            type="button"
            onClick={(e) => handleSubmit(e, true)}
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? '发布中...' : '发布文章'}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn btn-outline-secondary"
          >
            取消
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../services/userService';
import { fileService } from '../services/fileService';
import { authService } from '../services/authService';

/**
 * 用户个人中心页面
 *
 * 功能：
 * - 显示用户个人信息和统计数据
 * - 编辑个人资料（昵称、邮箱、简介）
 * - 上传头像
 * - 显示文章统计（总数、已发布、总浏览量、收藏数）
 */
const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    nickname: '',
    email: '',
    bio: '',
    avatar: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await userService.getCurrentUserProfile();
      setProfile(data);
      setFormData({
        nickname: data.nickname || '',
        email: data.email || '',
        bio: data.bio || '',
        avatar: data.avatar || ''
      });
    } catch (error) {
      console.error('加载个人资料失败:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('请选择图片文件');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('图片大小不能超过2MB');
      return;
    }

    try {
      setUploading(true);
      const result = await fileService.uploadImage(file);
      const avatarUrl = `${window.location.origin}/api${result.url}`;
      setFormData(prev => ({ ...prev, avatar: avatarUrl }));
      alert('头像上传成功！');
    } catch (error) {
      console.error('头像上传失败:', error);
      alert('头像上传失败，请重试');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updated = await userService.updateProfile(formData);
      setProfile(updated);
      setEditing(false);

      // 更新本地存储的用户信息
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        currentUser.nickname = updated.nickname;
        localStorage.setItem('user', JSON.stringify(currentUser));
      }

      alert('个人资料更新成功！');
    } catch (error) {
      console.error('更新个人资料失败:', error);
      alert(error.response?.data?.message || '更新失败，请重试');
    }
  };

  if (loading) {
    return <div className="container mt-5"><div>加载中...</div></div>;
  }

  if (!profile) {
    return <div className="container mt-5"><div>加载失败</div></div>;
  }

  return (
    <div className="container mt-5">
      <div className="row">
        {/* 左侧：个人信息 */}
        <div className="col-md-4">
          <div className="card">
            <div className="card-body text-center">
              <img
                src={formData.avatar || 'https://via.placeholder.com/150'}
                alt="头像"
                style={{
                  width: '150px',
                  height: '150px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  marginBottom: '1rem'
                }}
              />
              {editing && (
                <div className="mb-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    disabled={uploading}
                    className="form-control"
                  />
                  {uploading && <small className="text-muted">上传中...</small>}
                </div>
              )}
              <h4>{profile.nickname || profile.username}</h4>
              <p className="text-muted">@{profile.username}</p>
              <p className="text-muted">{profile.bio || '这个人很懒，什么都没写'}</p>
            </div>
          </div>

          {/* 统计信息 */}
          <div className="card mt-3">
            <div className="card-body">
              <h5 className="card-title">统计信息</h5>
              <div className="d-flex justify-content-between mb-2">
                <span>文章总数:</span>
                <strong>{profile.postCount || 0}</strong>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>已发布:</span>
                <strong>{profile.publishedPostCount || 0}</strong>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>总浏览量:</span>
                <strong>{profile.totalViews || 0}</strong>
              </div>
              <div className="d-flex justify-content-between">
                <span>收藏数:</span>
                <strong>{profile.favoriteCount || 0}</strong>
              </div>
            </div>
          </div>

          {/* 快捷操作 */}
          <div className="card mt-3">
            <div className="card-body">
              <h5 className="card-title">快捷操作</h5>
              <button
                className="btn btn-primary w-100 mb-2"
                onClick={() => navigate('/create-post')}
              >
                写文章
              </button>
              <button
                className="btn btn-secondary w-100 mb-2"
                onClick={() => navigate('/my-drafts')}
              >
                我的草稿
              </button>
              <button
                className="btn btn-info w-100"
                onClick={() => navigate('/my-favorites')}
              >
                我的收藏
              </button>
            </div>
          </div>
        </div>

        {/* 右侧：编辑资料 */}
        <div className="col-md-8">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">个人资料</h5>
              {!editing ? (
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => setEditing(true)}
                >
                  编辑资料
                </button>
              ) : (
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    setEditing(false);
                    setFormData({
                      nickname: profile.nickname || '',
                      email: profile.email || '',
                      bio: profile.bio || '',
                      avatar: profile.avatar || ''
                    });
                  }}
                >
                  取消编辑
                </button>
              )}
            </div>
            <div className="card-body">
              {!editing ? (
                <div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">用户名</label>
                    <p>{profile.username}</p>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">昵称</label>
                    <p>{profile.nickname || '未设置'}</p>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">邮箱</label>
                    <p>{profile.email}</p>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">个人简介</label>
                    <p>{profile.bio || '未设置'}</p>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">角色</label>
                    <p>{profile.role === 'ADMIN' ? '管理员' : '普通用户'}</p>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">注册时间</label>
                    <p>{new Date(profile.createdAt).toLocaleString('zh-CN')}</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">用户名</label>
                    <input
                      type="text"
                      className="form-control"
                      value={profile.username}
                      disabled
                    />
                    <small className="text-muted">用户名不可修改</small>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">昵称</label>
                    <input
                      type="text"
                      name="nickname"
                      className="form-control"
                      value={formData.nickname}
                      onChange={handleInputChange}
                      maxLength={100}
                      placeholder="输入昵称"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">邮箱</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">个人简介</label>
                    <textarea
                      name="bio"
                      className="form-control"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows={4}
                      maxLength={500}
                      placeholder="介绍一下你自己..."
                    />
                    <small className="text-muted">
                      {formData.bio.length}/500
                    </small>
                  </div>
                  <button type="submit" className="btn btn-primary">
                    保存修改
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

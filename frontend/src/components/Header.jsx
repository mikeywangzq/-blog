import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import ThemeToggle from './ThemeToggle';

const Header = () => {
  const navigate = useNavigate();
  const isAuthenticated = authService.isAuthenticated();
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    navigate('/');
    window.location.reload();
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            个人博客
          </Link>
          <nav className="nav">
            <Link to="/">首页</Link>
            <Link to="/posts">文章</Link>
            {isAuthenticated ? (
              <>
                <Link to="/create-post">写文章</Link>
                <Link to="/my-drafts">我的草稿</Link>
                <Link to="/my-favorites">我的收藏</Link>
                <Link to="/profile">个人中心</Link>
                <span style={{ marginLeft: '1rem' }}>欢迎, {user?.username}</span>
                <button onClick={handleLogout} className="btn btn-secondary" style={{ marginLeft: '0.5rem' }}>
                  退出
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-primary">
                  登录
                </Link>
                <Link to="/register" className="btn btn-secondary">
                  注册
                </Link>
              </>
            )}
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;

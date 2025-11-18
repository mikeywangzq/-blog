import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import ThemeToggle from './ThemeToggle';
import '../styles/Header.css';

/**
 * 导航栏组件 - 现代化设计
 * 包含Logo、导航菜单、用户操作、主题切换
 */
const Header = () => {
  const navigate = useNavigate();
  const isAuthenticated = authService.isAuthenticated();
  const user = authService.getCurrentUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    authService.logout();
    navigate('/');
    window.location.reload();
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          {/* Logo */}
          <Link to="/" className="logo" onClick={closeMobileMenu}>
            <svg className="logo-icon" viewBox="0 0 24 24" width="28" height="28">
              <path fill="currentColor" d="M19 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h4l3 3 3-3h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 3.5c1.84 0 3.48.96 4.34 2.5h-8.68c.86-1.54 2.5-2.5 4.34-2.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
            </svg>
            <span className="logo-text text-gradient">DevBlog</span>
          </Link>

          {/* 移动端菜单按钮 */}
          <button
            className={`mobile-menu-btn ${mobileMenuOpen ? 'active' : ''}`}
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          {/* 导航菜单 */}
          <nav className={`nav ${mobileMenuOpen ? 'mobile-open' : ''}`}>
            <div className="nav-links">
              <Link to="/" className="nav-link" onClick={closeMobileMenu}>
                <svg className="nav-icon" viewBox="0 0 24 24" width="18" height="18">
                  <path fill="currentColor" d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                </svg>
                <span>首页</span>
              </Link>

              <Link to="/posts" className="nav-link" onClick={closeMobileMenu}>
                <svg className="nav-icon" viewBox="0 0 24 24" width="18" height="18">
                  <path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                </svg>
                <span>文章</span>
              </Link>

              {isAuthenticated ? (
                <>
                  <Link to="/create-post" className="nav-link" onClick={closeMobileMenu}>
                    <svg className="nav-icon" viewBox="0 0 24 24" width="18" height="18">
                      <path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                    </svg>
                    <span>写文章</span>
                  </Link>

                  <Link to="/my-drafts" className="nav-link" onClick={closeMobileMenu}>
                    <svg className="nav-icon" viewBox="0 0 24 24" width="18" height="18">
                      <path fill="currentColor" d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
                    </svg>
                    <span>草稿</span>
                  </Link>

                  <Link to="/my-favorites" className="nav-link" onClick={closeMobileMenu}>
                    <svg className="nav-icon" viewBox="0 0 24 24" width="18" height="18">
                      <path fill="currentColor" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                    <span>收藏</span>
                  </Link>
                </>
              ) : null}
            </div>

            <div className="nav-actions">
              {isAuthenticated ? (
                <>
                  <Link to="/profile" className="user-profile" onClick={closeMobileMenu}>
                    <div className="user-avatar">
                      {user?.avatar ? (
                        <img src={user.avatar} alt={user.username} />
                      ) : (
                        <svg viewBox="0 0 24 24" width="20" height="20">
                          <path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                        </svg>
                      )}
                    </div>
                    <span className="username">{user?.username}</span>
                  </Link>

                  <button onClick={handleLogout} className="btn btn-outline">
                    退出
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn btn-outline" onClick={closeMobileMenu}>
                    登录
                  </Link>
                  <Link to="/register" className="btn btn-gradient" onClick={closeMobileMenu}>
                    注册
                  </Link>
                </>
              )}

              <ThemeToggle />
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;

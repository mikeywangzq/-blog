import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

/**
 * 主题切换按钮组件
 * 提供深色/浅色模式切换
 */
const ThemeToggle = () => {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="btn btn-outline-secondary"
      style={{
        border: 'none',
        background: 'transparent',
        fontSize: '1.25rem',
        cursor: 'pointer',
        padding: '0.25rem 0.5rem'
      }}
      title={isDark ? '切换到浅色模式' : '切换到深色模式'}
      aria-label="切换主题"
    >
      {isDark ? '🌞' : '🌙'}
    </button>
  );
};

export default ThemeToggle;

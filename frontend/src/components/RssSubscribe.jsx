import React, { useState } from 'react';
import '../styles/RssSubscribe.css';

/**
 * RSS订阅组件
 * 显示RSS订阅链接和订阅说明
 */
const RssSubscribe = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const rssUrl = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'}/rss/feed.xml`;

  const handleCopyRssUrl = async () => {
    try {
      await navigator.clipboard.writeText(rssUrl);
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 2000);
    } catch (error) {
      console.error('复制失败:', error);
      // 降级方案：使用传统方法
      const textArea = document.createElement('textarea');
      textArea.value = rssUrl;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setShowTooltip(true);
        setTimeout(() => setShowTooltip(false), 2000);
      } catch (err) {
        console.error('降级复制也失败:', err);
      }
      document.body.removeChild(textArea);
    }
  };

  return (
    <div className="rss-subscribe">
      <div className="rss-header">
        <span className="rss-icon">📡</span>
        <h3>RSS订阅</h3>
      </div>

      <p className="rss-description">
        通过RSS阅读器订阅本站，第一时间获取最新文章更新
      </p>

      <div className="rss-actions">
        <a
          href={rssUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rss-link"
        >
          <span className="rss-link-icon">🔗</span>
          打开订阅源
        </a>

        <button
          onClick={handleCopyRssUrl}
          className="rss-copy-btn"
          title="复制RSS链接"
        >
          <span className="copy-icon">📋</span>
          复制链接
          {showTooltip && <span className="copy-tooltip">已复制!</span>}
        </button>
      </div>

      <div className="rss-readers">
        <p className="readers-title">推荐RSS阅读器：</p>
        <ul className="readers-list">
          <li>
            <a href="https://feedly.com" target="_blank" rel="noopener noreferrer">
              Feedly
            </a>
          </li>
          <li>
            <a href="https://www.inoreader.com" target="_blank" rel="noopener noreferrer">
              Inoreader
            </a>
          </li>
          <li>
            <a href="https://reederapp.com" target="_blank" rel="noopener noreferrer">
              Reeder
            </a>
          </li>
        </ul>
      </div>

      <div className="rss-url-display">
        <code>{rssUrl}</code>
      </div>
    </div>
  );
};

export default RssSubscribe;

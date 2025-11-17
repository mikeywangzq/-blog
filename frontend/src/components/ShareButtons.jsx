import React, { useState } from 'react';

/**
 * 社交媒体分享按钮组件
 * 支持分享到微博、Twitter、Facebook、LinkedIn等平台
 */
const ShareButtons = ({ title, url, summary }) => {
  const [showCopySuccess, setShowCopySuccess] = useState(false);

  const shareUrl = url || window.location.href;
  const shareTitle = encodeURIComponent(title || document.title);
  const shareSummary = encodeURIComponent(summary || '');

  // 分享到新浪微博
  const shareToWeibo = () => {
    const weiboUrl = `https://service.weibo.com/share/share.php?url=${encodeURIComponent(shareUrl)}&title=${shareTitle}&pic=&appkey=`;
    window.open(weiboUrl, '_blank', 'width=600,height=400');
  };

  // 分享到Twitter
  const shareToTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${shareTitle}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
  };

  // 分享到Facebook
  const shareToFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
  };

  // 分享到LinkedIn
  const shareToLinkedIn = () => {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    window.open(linkedInUrl, '_blank', 'width=600,height=400');
  };

  // 复制链接
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setShowCopySuccess(true);
      setTimeout(() => setShowCopySuccess(false), 2000);
    } catch (error) {
      console.error('复制失败:', error);
      // 降级方案
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setShowCopySuccess(true);
      setTimeout(() => setShowCopySuccess(false), 2000);
    }
  };

  // 通过邮件分享
  const shareByEmail = () => {
    const subject = encodeURIComponent(title || '');
    const body = encodeURIComponent(`${summary || ''}\n\n${shareUrl}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const buttonStyle = {
    padding: '0.5rem 1rem',
    margin: '0.25rem',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    transition: 'all 0.2s',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem'
  };

  return (
    <div style={{ marginTop: '1rem' }}>
      <h6 style={{ marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>分享到</h6>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        <button
          onClick={shareToWeibo}
          style={{ ...buttonStyle, backgroundColor: '#e6162d', color: 'white' }}
          onMouseEnter={(e) => e.target.style.opacity = '0.8'}
          onMouseLeave={(e) => e.target.style.opacity = '1'}
        >
          <span>📱</span>
          微博
        </button>

        <button
          onClick={shareToTwitter}
          style={{ ...buttonStyle, backgroundColor: '#1da1f2', color: 'white' }}
          onMouseEnter={(e) => e.target.style.opacity = '0.8'}
          onMouseLeave={(e) => e.target.style.opacity = '1'}
        >
          <span>🐦</span>
          Twitter
        </button>

        <button
          onClick={shareToFacebook}
          style={{ ...buttonStyle, backgroundColor: '#1877f2', color: 'white' }}
          onMouseEnter={(e) => e.target.style.opacity = '0.8'}
          onMouseLeave={(e) => e.target.style.opacity = '1'}
        >
          <span>📘</span>
          Facebook
        </button>

        <button
          onClick={shareToLinkedIn}
          style={{ ...buttonStyle, backgroundColor: '#0077b5', color: 'white' }}
          onMouseEnter={(e) => e.target.style.opacity = '0.8'}
          onMouseLeave={(e) => e.target.style.opacity = '1'}
        >
          <span>💼</span>
          LinkedIn
        </button>

        <button
          onClick={shareByEmail}
          style={{ ...buttonStyle, backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
          onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--bg-tertiary)'}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--bg-secondary)'}
        >
          <span>📧</span>
          邮件
        </button>

        <button
          onClick={copyLink}
          style={{
            ...buttonStyle,
            backgroundColor: showCopySuccess ? '#28a745' : 'var(--bg-secondary)',
            color: showCopySuccess ? 'white' : 'var(--text-primary)',
            border: '1px solid var(--border-color)'
          }}
          onMouseEnter={(e) => !showCopySuccess && (e.target.style.backgroundColor = 'var(--bg-tertiary)')}
          onMouseLeave={(e) => !showCopySuccess && (e.target.style.backgroundColor = 'var(--bg-secondary)')}
        >
          <span>{showCopySuccess ? '✓' : '🔗'}</span>
          {showCopySuccess ? '已复制!' : '复制链接'}
        </button>
      </div>
    </div>
  );
};

export default ShareButtons;

import React, { useState, useEffect } from 'react';

/**
 * 文章目录（TOC）组件
 *
 * 功能：
 * - 从Markdown内容中自动提取标题
 * - 生成可点击的目录结构
 * - 支持锚点跳转
 * - 高亮当前阅读位置
 * - 固定在页面右侧（建议使用sticky定位）
 */
const TableOfContents = ({ content }) => {
  const [headings, setHeadings] = useState([]);
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    if (!content) return;

    // 解析Markdown内容，提取标题
    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    const matches = [];
    let match;

    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = generateId(text);

      matches.push({
        level,
        text,
        id,
      });
    }

    setHeadings(matches);
  }, [content]);

  useEffect(() => {
    // 监听滚动事件，高亮当前标题
    const handleScroll = () => {
      const headingElements = headings.map(h => document.getElementById(h.id)).filter(Boolean);

      for (let i = headingElements.length - 1; i >= 0; i--) {
        const heading = headingElements[i];
        if (heading && heading.getBoundingClientRect().top <= 100) {
          setActiveId(heading.id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings]);

  const generateId = (text) => {
    // 生成标题ID（用于锚点）
    return text
      .toLowerCase()
      .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleClick = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveId(id);
    }
  };

  if (headings.length === 0) {
    return null;
  }

  return (
    <div
      className="table-of-contents"
      style={{
        position: 'sticky',
        top: '80px',
        maxHeight: 'calc(100vh - 100px)',
        overflowY: 'auto',
        padding: '1rem',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #dee2e6',
      }}
    >
      <h6 className="fw-bold mb-3">目录</h6>
      <nav>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {headings.map((heading, index) => (
            <li
              key={index}
              style={{
                paddingLeft: `${(heading.level - 1) * 1}rem`,
                marginBottom: '0.5rem',
              }}
            >
              <a
                href={`#${heading.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleClick(heading.id);
                }}
                style={{
                  textDecoration: 'none',
                  color: activeId === heading.id ? '#007bff' : '#6c757d',
                  fontWeight: activeId === heading.id ? 'bold' : 'normal',
                  fontSize: heading.level === 1 ? '0.95rem' : '0.875rem',
                  display: 'block',
                  transition: 'all 0.2s',
                }}
                className="toc-link"
                onMouseEnter={(e) => {
                  if (activeId !== heading.id) {
                    e.target.style.color = '#007bff';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeId !== heading.id) {
                    e.target.style.color = '#6c757d';
                  }
                }}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default TableOfContents;

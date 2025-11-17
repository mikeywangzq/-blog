import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { archiveService } from '../services/archiveService';

/**
 * 归档组件（侧边栏小部件）
 * 显示文章归档列表
 */
const ArchiveWidget = () => {
  const [archives, setArchives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadArchives();
  }, []);

  const loadArchives = async () => {
    try {
      setLoading(true);
      const data = await archiveService.getArchives();
      setArchives(data);
    } catch (error) {
      console.error('加载归档失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleArchiveClick = (year, month) => {
    navigate(`/archives/${year}/${month}`);
  };

  if (loading) {
    return <div className="text-muted">加载中...</div>;
  }

  if (archives.length === 0) {
    return null;
  }

  return (
    <div className="sidebar">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '0.5rem',
          cursor: 'pointer'
        }}
        onClick={() => setCollapsed(!collapsed)}
      >
        <h3>文章归档</h3>
        <span style={{ fontSize: '1.2rem' }}>{collapsed ? '▼' : '▲'}</span>
      </div>
      {!collapsed && (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {archives.map((archive, index) => (
            <li key={index} style={{ marginBottom: '0.5rem' }}>
              <a
                onClick={() => handleArchiveClick(archive.year, archive.month)}
                style={{
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  transition: 'background-color 0.2s',
                  textDecoration: 'none',
                  color: 'var(--text-primary)'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--bg-secondary)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                <span>📅 {archive.archiveName}</span>
                <span className="badge bg-secondary">{archive.count}</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ArchiveWidget;

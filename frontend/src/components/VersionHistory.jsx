import React, { useEffect, useState } from 'react';
import { versionService } from '../services/versionService';
import '../styles/VersionHistory.css';

/**
 * 版本历史组件
 * 显示文章的所有历史版本
 */
const VersionHistory = ({ postId, onVersionSelect }) => {
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [selectedVersions, setSelectedVersions] = useState([]);

  useEffect(() => {
    loadVersionHistory();
    loadStats();
  }, [postId]);

  const loadVersionHistory = async () => {
    try {
      setLoading(true);
      const data = await versionService.getVersionHistory(postId);
      setVersions(data);
    } catch (err) {
      setError('加载版本历史失败');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const data = await versionService.getVersionStats(postId);
      setStats(data);
    } catch (err) {
      console.error('加载版本统计失败:', err);
    }
  };

  const handleVersionClick = (version) => {
    if (onVersionSelect) {
      onVersionSelect(version);
    }
  };

  const handleCompareSelect = (versionNum) => {
    setSelectedVersions(prev => {
      if (prev.includes(versionNum)) {
        return prev.filter(v => v !== versionNum);
      }
      if (prev.length >= 2) {
        return [prev[1], versionNum];
      }
      return [...prev, versionNum];
    });
  };

  const handleCompare = () => {
    if (selectedVersions.length === 2) {
      window.open(
        `/posts/${postId}/compare?v1=${selectedVersions[0]}&v2=${selectedVersions[1]}`,
        '_blank'
      );
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN');
  };

  if (loading) {
    return <div className="version-loading">加载中...</div>;
  }

  if (error) {
    return <div className="version-error">{error}</div>;
  }

  if (versions.length === 0) {
    return (
      <div className="version-empty">
        <p>暂无版本历史</p>
        <p className="version-empty-hint">文章首次创建时不会生成版本，仅在更新时记录</p>
      </div>
    );
  }

  return (
    <div className="version-history">
      <div className="version-header">
        <h3>版本历史</h3>
        {stats && (
          <span className="version-count">共 {stats.totalVersions} 个版本</span>
        )}
      </div>

      {selectedVersions.length === 2 && (
        <div className="version-compare-bar">
          <span>已选择版本 {selectedVersions[0]} 和 {selectedVersions[1]}</span>
          <button onClick={handleCompare} className="compare-btn">
            对比版本
          </button>
          <button
            onClick={() => setSelectedVersions([])}
            className="cancel-btn"
          >
            取消
          </button>
        </div>
      )}

      <div className="version-list">
        {versions.map((version) => (
          <div
            key={version.id}
            className={`version-item ${
              selectedVersions.includes(version.version) ? 'selected' : ''
            }`}
          >
            <div className="version-main">
              <div className="version-info">
                <div className="version-number">
                  <span className="version-badge">v{version.version}</span>
                  <span className="version-time">
                    {formatDate(version.createdAt)}
                  </span>
                </div>
                <div className="version-meta">
                  <span className="version-author">
                    {version.createdByUsername || '未知用户'}
                  </span>
                  {version.changeNote && (
                    <span className="version-note">{version.changeNote}</span>
                  )}
                </div>
              </div>

              <div className="version-actions">
                <button
                  onClick={() => handleVersionClick(version)}
                  className="view-btn"
                  title="查看此版本"
                >
                  查看
                </button>
                <label className="compare-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedVersions.includes(version.version)}
                    onChange={() => handleCompareSelect(version.version)}
                    disabled={
                      selectedVersions.length >= 2 &&
                      !selectedVersions.includes(version.version)
                    }
                  />
                  <span>对比</span>
                </label>
              </div>
            </div>

            <div className="version-preview">
              <div className="preview-title">{version.title}</div>
              {version.summary && (
                <div className="preview-summary">{version.summary}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VersionHistory;

import React, { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { fileService } from '../services/fileService';

const MarkdownEditor = ({ value, onChange }) => {
  const [showPreview, setShowPreview] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  /**
   * 处理图片上传
   */
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      alert('请选择图片文件');
      return;
    }

    // 验证文件大小（5MB）
    if (file.size > 5 * 1024 * 1024) {
      alert('图片大小不能超过5MB');
      return;
    }

    try {
      setUploading(true);
      const result = await fileService.uploadImage(file);

      // 构建Markdown图片语法并插入到当前内容中
      const imageMarkdown = `\n![${file.name}](${window.location.origin}/api${result.url})\n`;
      onChange(value + imageMarkdown);

      // 清空文件input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      alert('图片上传成功！');
    } catch (error) {
      console.error('图片上传失败:', error);
      alert(error.response?.data?.message || '图片上传失败，请重试');
    } finally {
      setUploading(false);
    }
  };

  /**
   * 触发文件选择
   */
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div style={{ border: '1px solid #ddd', borderRadius: '4px', overflow: 'hidden' }}>
      <div style={{ borderBottom: '1px solid #ddd', padding: '0.5rem', backgroundColor: '#f5f5f5', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <button
          type="button"
          onClick={() => setShowPreview(false)}
          style={{
            padding: '0.5rem 1rem',
            border: 'none',
            backgroundColor: !showPreview ? '#007bff' : 'transparent',
            color: !showPreview ? 'white' : '#333',
            cursor: 'pointer',
            borderRadius: '4px',
          }}
        >
          编辑
        </button>
        <button
          type="button"
          onClick={() => setShowPreview(true)}
          style={{
            padding: '0.5rem 1rem',
            border: 'none',
            backgroundColor: showPreview ? '#007bff' : 'transparent',
            color: showPreview ? 'white' : '#333',
            cursor: 'pointer',
            borderRadius: '4px',
          }}
        >
          预览
        </button>

        {/* 图片上传按钮 */}
        {!showPreview && (
          <>
            <div style={{ borderLeft: '1px solid #ddd', height: '24px', marginLeft: '0.5rem' }}></div>
            <button
              type="button"
              onClick={triggerFileInput}
              disabled={uploading}
              style={{
                padding: '0.5rem 1rem',
                border: '1px solid #28a745',
                backgroundColor: 'white',
                color: '#28a745',
                cursor: uploading ? 'not-allowed' : 'pointer',
                borderRadius: '4px',
                opacity: uploading ? 0.6 : 1,
              }}
            >
              {uploading ? '上传中...' : '📷 上传图片'}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />
          </>
        )}
      </div>

      {!showPreview ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: '100%',
            minHeight: '400px',
            padding: '1rem',
            border: 'none',
            fontFamily: 'monospace',
            fontSize: '14px',
            resize: 'vertical',
          }}
          placeholder="支持 Markdown 格式...

示例：
# 一级标题
## 二级标题

**粗体** *斜体*

- 列表项
- 列表项

```代码块```

[链接](https://example.com)
"
        />
      ) : (
        <div
          style={{
            minHeight: '400px',
            padding: '1rem',
            backgroundColor: '#fff',
          }}
          className="markdown-preview"
        >
          <ReactMarkdown>{value || '暂无内容'}</ReactMarkdown>
        </div>
      )}
    </div>
  );
};

export default MarkdownEditor;

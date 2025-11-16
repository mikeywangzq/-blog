import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';

const MarkdownEditor = ({ value, onChange }) => {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div style={{ border: '1px solid #ddd', borderRadius: '4px', overflow: 'hidden' }}>
      <div style={{ borderBottom: '1px solid #ddd', padding: '0.5rem', backgroundColor: '#f5f5f5' }}>
        <button
          type="button"
          onClick={() => setShowPreview(false)}
          style={{
            padding: '0.5rem 1rem',
            marginRight: '0.5rem',
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

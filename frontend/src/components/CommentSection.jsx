import React, { useEffect, useState } from 'react';
import { commentService } from '../services/commentService';
import { authService } from '../services/authService';
import { formatDate } from '../utils/formatDate';

const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const isAuthenticated = authService.isAuthenticated();
  const currentUser = authService.getCurrentUser();

  useEffect(() => {
    loadComments();
  }, [postId, currentPage]);

  const loadComments = async () => {
    try {
      setLoading(true);
      const data = await commentService.getCommentsByPostId(postId, currentPage);
      setComments(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('加载评论失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      await commentService.createComment({
        postId,
        content,
        parentId: replyTo,
      });
      setContent('');
      setReplyTo(null);
      loadComments();
    } catch (error) {
      console.error('发表评论失败:', error);
      alert('发表评论失败');
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm('确定要删除这条评论吗？')) return;

    try {
      await commentService.deleteComment(commentId);
      loadComments();
    } catch (error) {
      console.error('删除评论失败:', error);
      alert('删除失败');
    }
  };

  const renderComment = (comment, isReply = false) => (
    <div
      key={comment.id}
      style={{
        marginLeft: isReply ? '2rem' : '0',
        marginBottom: '1rem',
        padding: '1rem',
        backgroundColor: isReply ? '#fafafa' : '#fff',
        borderLeft: isReply ? '3px solid #007bff' : 'none',
        borderRadius: '4px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
        {comment.userAvatar && (
          <img
            src={comment.userAvatar}
            alt={comment.username}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              marginRight: '0.5rem',
            }}
          />
        )}
        <strong>{comment.username}</strong>
        <span style={{ color: '#999', marginLeft: '0.5rem', fontSize: '0.9rem' }}>
          {formatDate(comment.createdAt)}
        </span>
      </div>

      <p style={{ margin: '0.5rem 0' }}>{comment.content}</p>

      <div style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem' }}>
        {isAuthenticated && !isReply && (
          <button
            onClick={() => setReplyTo(comment.id)}
            style={{
              background: 'none',
              border: 'none',
              color: '#007bff',
              cursor: 'pointer',
            }}
          >
            回复
          </button>
        )}
        {currentUser && currentUser.id === comment.userId && (
          <button
            onClick={() => handleDelete(comment.id)}
            style={{
              background: 'none',
              border: 'none',
              color: '#dc3545',
              cursor: 'pointer',
            }}
          >
            删除
          </button>
        )}
      </div>

      {replyTo === comment.id && (
        <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={`回复 ${comment.username}...`}
            style={{
              width: '100%',
              padding: '0.5rem',
              borderRadius: '4px',
              border: '1px solid #ddd',
              minHeight: '80px',
            }}
          />
          <div style={{ marginTop: '0.5rem' }}>
            <button type="submit" className="btn btn-primary" style={{ marginRight: '0.5rem' }}>
              发表回复
            </button>
            <button
              type="button"
              onClick={() => {
                setReplyTo(null);
                setContent('');
              }}
              className="btn btn-secondary"
            >
              取消
            </button>
          </div>
        </form>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          {comment.replies.map((reply) => renderComment(reply, true))}
        </div>
      )}
    </div>
  );

  if (loading) {
    return <div>加载评论中...</div>;
  }

  return (
    <div style={{ marginTop: '2rem' }}>
      <h3>评论 ({comments.length})</h3>

      {isAuthenticated ? (
        <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="写下你的评论..."
            className="form-control"
            rows={4}
          />
          <button
            type="submit"
            className="btn btn-primary"
            style={{ marginTop: '0.5rem' }}
            disabled={!content.trim()}
          >
            发表评论
          </button>
        </form>
      ) : (
        <p style={{ color: '#999', marginBottom: '2rem' }}>
          请先登录后再发表评论
        </p>
      )}

      <div>
        {comments.length === 0 ? (
          <p>暂无评论，快来抢沙发吧！</p>
        ) : (
          comments.map((comment) => renderComment(comment))
        )}
      </div>

      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem' }}>
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 0}
            className="btn btn-secondary"
          >
            上一页
          </button>
          <span style={{ padding: '0.5rem 1rem' }}>
            {currentPage + 1} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages - 1}
            className="btn btn-secondary"
          >
            下一页
          </button>
        </div>
      )}
    </div>
  );
};

export default CommentSection;

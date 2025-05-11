import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import '../pages/styles.css';
import { useAuth } from '../contexts/AuthContext';

function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchPost();
    // eslint-disable-next-line
  }, [id]);

  const fetchPost = async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await api.get(`/posts/${id}`);
      console.log('Post detail response:', response);
      if (!response.data || !response.data.title) {
        setError('Post not found or invalid response from server.');
        setPost(null);
        return;
      }
      // Ensure author is a string
      const processedPost = {
        ...response.data,
        author: typeof response.data.author === 'object' ? response.data.author.username : response.data.author || 'Anonymous',
        comments: (response.data.comments || []).map(comment => ({
          ...comment,
          username: comment.username || (comment.user && comment.user.username) || 'Anonymous',
          text: comment.text || comment.content || ''
        }))
      };
      setPost(processedPost);
    } catch (err) {
      console.error('Error fetching post:', err);
      if (err.response && err.response.status === 404) {
        setError('Post not found.');
      } else if (err.response && err.response.status === 401) {
        setError('You are not authorized to view this post. Please log in.');
      } else {
        setError('Failed to fetch post.');
      }
      setPost(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      setError('');
      const response = await api.post(
        `/posts/${id}/comments`,
        { text: newComment.trim() }
      );
      setPost(prev => ({
        ...prev,
        comments: [...(prev.comments || []), {
          ...response.data,
          username: response.data.username,
          text: response.data.text
        }]
      }));
      setNewComment('');
    } catch (err) {
      setError('Failed to add comment');
    }
  };

  // Helper to format numbers (e.g., 6100 -> 6.1K)
  const formatCount = (num) => {
    if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    return num;
  };

  if (isLoading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!post) return null;

  return (
    <div className="home-container">
      <div className="form-container post-card" style={{ background: '#232629', borderRadius: '1.5rem', boxShadow: '0 2px 16px 0 rgba(60,60,60,0.08)', border: '1px solid #343536', color: '#fff', marginBottom: '2rem', padding: '2rem 2.5rem' }}>
        <div className="post-header" style={{ marginBottom: '1.2rem' }}>
          <h3 style={{ fontWeight: 700, fontSize: '1.3rem', color: '#fff', margin: 0 }}>{post.title}</h3>
          <span className="post-author" style={{ color: '#b0b0b0', fontSize: '0.95rem', marginTop: '0.2rem', display: 'block' }}>
            Posted by {post.author}
          </span>
        </div>
        <div className="post-content" style={{ color: '#fff', margin: '1rem 0', fontSize: '1.08rem', lineHeight: 1.7 }}>
          {post.content}
        </div>
        <div className="post-bar">
          <div className="vote-pill">
            <span className="vote-icon">▲</span>
            <span className="vote-score">{formatCount(post.score || 0)}</span>
            <span className="vote-icon">▼</span>
          </div>
          <div className="comment-pill">
            <span className="comment-icon" aria-label="comments">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 15V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6l-3 3z" stroke="#d7dadc" strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
              </svg>
            </span>
            <span className="comment-count">{formatCount(post.comments?.length || 0)}</span>
          </div>
        </div>
        <div className="comments-section" style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #343536', width: '100%' }}>
          <h4 style={{ color: '#fff', fontWeight: 600, fontSize: '1.08rem', marginBottom: '1.2rem' }}>Comments</h4>
          {post.comments?.map((comment) => (
            <div key={comment._id} className="comment" style={{ background: '#232629', padding: '1rem 1.5rem', borderRadius: '0.7rem', marginBottom: '1.2rem', boxShadow: '0 1px 4px 0 rgba(0,0,0,0.08)' }}>
              <div className="comment-header" style={{ marginBottom: '0.2rem' }}>
                <span className="comment-author" style={{ fontWeight: 600, color: '#ffb000', fontSize: '1rem' }}>
                  {comment.username}
                </span>
              </div>
              <div className="comment-content" style={{ color: '#fff', fontSize: '1.05rem', lineHeight: 1.6, marginTop: 2 }}>
                {comment.text}
              </div>
            </div>
          ))}
          <form onSubmit={handleAddComment} className="comment-form">
            <textarea
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              required
              className="form-input comment-input"
            />
            <button type="submit" className="form-button comment-button">
              Comment
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PostDetail; 
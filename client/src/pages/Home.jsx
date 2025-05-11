import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import '../pages/styles.css';
import { useAuth } from '../contexts/AuthContext';

function Home() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [newComment, setNewComment] = useState({ content: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchPosts(currentPage);
  }, [currentPage]);

  const fetchPosts = async (page) => {
    try {
      setIsLoading(true);
      setError('');
      const response = await api.get('/posts', {
        params: {
          page,
          limit: 10
        }
      });
      
      const { posts, currentPage, totalPages } = response.data;
      setPosts(posts.map(post => ({
        ...post,
        author: typeof post.author === 'object' ? post.author.username : post.author || 'Anonymous'
      })));
      setCurrentPage(currentPage);
      setTotalPages(totalPages);
    } catch (err) {
      setError(err.message || 'Failed to fetch posts');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      setError('');
      
      // Validate input
      if (newPost.title.length > 100) {
        throw new Error('Title must be less than 100 characters');
      }
      if (newPost.content.length > 5000) {
        throw new Error('Content must be less than 5000 characters');
      }

      const response = await api.post('/posts', newPost);
      const processedPost = {
        ...response.data,
        author: typeof response.data.author === 'object' ? response.data.author.username : response.data.author || 'Anonymous'
      };
      setPosts([processedPost, ...posts]);
      setNewPost({ title: '', content: '' });
    } catch (err) {
      setError(err.message || 'Failed to create post');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpvote = async (postId) => {
    if (!user) return;
    try {
      setError('');
      const response = await api.put(`/posts/${postId}/upvote`);
      
      setPosts(posts.map(post => {
        if (post._id === postId) {
          const updatedPost = { 
            ...post, 
            score: response.data.score,
            upvotes: response.data.upvotes || [],
            downvotes: response.data.downvotes || []
          };
          return updatedPost;
        }
        return post;
      }));
    } catch (error) {
      setError(error.message || 'Failed to upvote post');
    }
  };

  const handleDownvote = async (postId) => {
    if (!user) return;
    try {
      setError('');
      const response = await api.put(`/posts/${postId}/downvote`);
      
      setPosts(posts.map(post => {
        if (post._id === postId) {
          const updatedPost = { 
            ...post, 
            score: response.data.score,
            upvotes: response.data.upvotes || [],
            downvotes: response.data.downvotes || []
          };
          return updatedPost;
        }
        return post;
      }));
    } catch (error) {
      setError(error.message || 'Failed to downvote post');
    }
  };

  const handleAddComment = async (postId, e) => {
    e.preventDefault();
    const commentContent = newComment[postId];
    
    if (!commentContent || commentContent.trim() === '') {
      setError('Comment cannot be empty');
      return;
    }

    try {
      setError('');
      const response = await api.post(`/posts/${postId}/comments`, {
        text: commentContent.trim()
      });

      setPosts(posts.map(post => {
        if (post._id === postId) {
          return {
            ...post,
            comments: [...(post.comments || []), response.data]
          };
        }
        return post;
      }));

      // Clear the comment input for this post
      setNewComment(prev => ({ ...prev, [postId]: '' }));
    } catch (err) {
      setError(err.message || 'Failed to add comment');
    }
  };

  const handleCommentChange = (postId, value) => {
    setNewComment(prev => ({ ...prev, [postId]: value }));
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (isLoading && currentPage === 1) return <div className="loading">Loading...</div>;

  const formatCount = (num) => {
    if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    return num;
  };

  return (
    <div className="home-container">
      {/* Create Post Section */}
      <div className="form-container create-post">
        <h2>Create a Post</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleCreatePost}>
          <input
            type="text"
            placeholder="Title *"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
            required
            maxLength={100}
            className="form-input"
          />
          <textarea
            placeholder="What's on your mind? *"
            value={newPost.content}
            onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
            required
            maxLength={5000}
            className="form-input post-content"
          />
          <button 
            type="submit" 
            className="form-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Posting...' : 'Post'}
          </button>
        </form>
      </div>

      {/* Posts Section */}
      <div className="posts-section">
        {posts.map((post) => (
          <div key={post._id} className="form-container post-card" style={{ background: '#232629', borderRadius: '1.5rem', boxShadow: '0 2px 16px 0 rgba(60,60,60,0.08)', border: '1px solid #343536', color: '#fff', marginBottom: '2rem', padding: '2rem 2.5rem' }}>
            <div className="post-header" style={{ marginBottom: '1.2rem' }}>
              <Link to={`/posts/${post._id}`} style={{ textDecoration: 'none' }}>
                <h3 style={{ fontWeight: 700, fontSize: '1.3rem', color: '#fff', margin: 0, cursor: 'pointer' }}>{post.title}</h3>
              </Link>
              <span className="post-author" style={{ color: '#b0b0b0', fontSize: '0.95rem', marginTop: '0.2rem', display: 'block' }}>
                Posted by {post.author}
              </span>
            </div>
            <div className="post-content" style={{ color: '#fff', margin: '1rem 0', fontSize: '1.08rem', lineHeight: 1.7, maxHeight: '4.5em', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {post.content}
            </div>

            {/* Vote and comment bar */}
            <div className="post-bar">
              <div className="vote-pill">
                <button 
                  onClick={() => handleUpvote(post._id)}
                  className={`vote-icon ${post.upvotes?.includes(user?.id) ? 'active' : ''}`}
                  title={post.upvotes?.includes(user?.id) ? 'Remove upvote' : 'Upvote'}
                >
                  ▲
                </button>
                <span className="vote-score">{formatCount(post.score || 0)}</span>
                <button 
                  onClick={() => handleDownvote(post._id)}
                  className={`vote-icon ${post.downvotes?.includes(user?.id) ? 'active' : ''}`}
                  title={post.downvotes?.includes(user?.id) ? 'Remove downvote' : 'Downvote'}
                >
                  ▼
                </button>
              </div>
              <Link to={`/posts/${post._id}`} className="comment-pill">
                <span className="comment-icon" aria-label="comments">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 15V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6l-3 3z" stroke="#d7dadc" strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
                  </svg>
                </span>
                <span className="comment-count">{formatCount(post.comments?.length || 0)}</span>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="pagination-button"
          >
            Previous
          </button>
          <span className="pagination-info">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="pagination-button"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default Home;



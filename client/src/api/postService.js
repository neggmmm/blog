import api from './axios';

// Edit post
export const editPost = (postId, data) => api.put(`/posts/${postId}`, data);
// Delete post
export const deletePost = (postId) => api.delete(`/posts/${postId}`);

// Edit comment
export const editComment = (commentId, data) => api.put(`/comments/${commentId}`, data);
// Delete comment
export const deleteComment = (commentId) => api.delete(`/comments/${commentId}`); 
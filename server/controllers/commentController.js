// controllers/commentController.js
import Comment from '../model/Comment.js';
import Post from '../model/Post.js';

// ✅ Add a new comment
export const addComment = async (req, res) => {
    try {
      const { text } = req.body;
      const { postId } = req.params;
      const { id: userId, username } = req.user;
  
      if (!text?.trim()) {
        return res.status(400).json({ message: 'Comment text is required' });
      }
  
      // 1. Create the comment
      const newComment = await Comment.create({
        text,
        user: userId,
        username,
        post: postId,
      });
  
      // 2. Update the post's comments array
      await Post.findByIdAndUpdate(
        postId,
        { $push: { comments: newComment._id }, $inc: { commentCount: 1 } },
        { new: true }
      );
  
      res.status(201).json(newComment);
  
    } catch (err) {
      console.error("Error adding comment:", err);
      res.status(500).json({ message: 'Failed to add comment' });
    }
  };

// ✅ Get all comments for a post
export const getComments = async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await Comment.find({ post: postId });
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Delete a comment (only by author or admin)
export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const comment = await Comment.findById(commentId);
    
    if (!comment) return res.status(404).json({ message: "Comment not found" });
    
    // تحقق إذا كان المستخدم هو صاحب التعليق
    if (comment.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this comment" });
    }
    
    await Post.findByIdAndUpdate(
      comment.post,
      { $pull: { comments: commentId }, $inc: { commentCount: -1 } },
      { new: true }
    );
    res.status(200).json({ message: "Comment deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const editComment = async (req,res) =>{
  try{
  const {commentId} = req.params ;
  const comment = await Comment.findById(commentId);
  if(!comment) return res.status(404).json({messange:"Comment not exist"});
  
  if(comment.user.toString() !== req.user.id){
    return res.status(403).json({message:"Not authorized to edit this comment!"});
  }
  const {text} = req.body;
  comment.text = text;
  await comment.save();
  res.status(200).json({message:"Edited !"})
  }catch(err){ 
    res.status(500).json({message:err.message});
  }
}
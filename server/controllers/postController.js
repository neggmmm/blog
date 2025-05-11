// controllers/postController.js
import Post from '../model/Post.js';
import mongoose from 'mongoose';

// GET /api/posts
export const getPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .populate('comments')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments();

    res.status(200).json({
      posts,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalPosts: total
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/posts
export const createPost = async (req, res, next) => {
  try {
    const { title, content, image } = req.body;

    const newPost = await Post.create({
      title,
      content,
      image,
      author: {
        id: req.user.id,
      },
      username: req.user.username,
    });

    res.status(201).json(newPost);
  } catch (err) {
    next(err);
  }
};

export const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }

    const post = await Post.findById(id);
    
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    
    if (post.author.id.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this post" });
    }
    
    await Post.findByIdAndDelete(id);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    next(err);
  }
};

export const updatePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }

    const post = await Post.findById(id);
    
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    
    if (post.author.id.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this post" });
    }
    
    const updatedPost = await Post.findByIdAndUpdate(
      id, 
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    
    res.status(200).json(updatedPost);
  } catch (err) {
    next(err);
  }
};

export const upVotePost = async (req, res) => {
  try {
    console.log('Upvoting post:', {
      postId: req.params.id,
      userId: req.user.id,
      user: req.user
    });

    const post = await Post.findById(req.params.id);
    if (!post) {
      console.log('Post not found:', req.params.id);
      return res.status(404).json({ message: 'Post not found' });
    }

    console.log('Found post:', {
      postId: post._id,
      currentScore: post.score,
      currentUpvotes: post.upvotes,
      currentDownvotes: post.downvotes
    });

    // Ensure arrays exist
    if (!Array.isArray(post.upvotes)) post.upvotes = [];
    if (!Array.isArray(post.downvotes)) post.downvotes = [];
    if (typeof post.score !== 'number') post.score = 0;

    const userId = new mongoose.Types.ObjectId(req.user.id);
    const userIdStr = userId.toString();

    // Check if user has already upvoted
    const hasUpvoted = post.upvotes.some(id => id.toString() === userIdStr);
    const hasDownvoted = post.downvotes.some(id => id.toString() === userIdStr);

    console.log('Vote status:', {
      hasUpvoted,
      hasDownvoted,
      userIdStr
    });

    if (hasUpvoted) {
      // Remove upvote
      post.upvotes = post.upvotes.filter(id => id.toString() !== userIdStr);
      post.score -= 1;
    } else {
      // Add upvote
      post.upvotes.push(userId);
      post.score += 1;
      
      // Remove downvote if exists
      if (hasDownvoted) {
        post.downvotes = post.downvotes.filter(id => id.toString() !== userIdStr);
        post.score += 1; // Compensate for removing downvote
      }
    }

    console.log('Updated post:', {
      newScore: post.score,
      newUpvotes: post.upvotes,
      newDownvotes: post.downvotes
    });

    const updatedPost = await post.save();
    console.log('Saved post:', updatedPost);
    res.json(updatedPost);
  } catch (error) {
    console.error('Error in upVotePost:', {
      error: error.message,
      stack: error.stack,
      postId: req.params.id,
      userId: req.user?.id
    });
    res.status(500).json({ message: 'Error updating vote', error: error.message });
  }
};

export const downVotePost = async (req, res) => {
  try {
    console.log('Downvoting post:', {
      postId: req.params.id,
      userId: req.user.id,
      user: req.user
    });

    const post = await Post.findById(req.params.id);
    if (!post) {
      console.log('Post not found:', req.params.id);
      return res.status(404).json({ message: 'Post not found' });
    }

    console.log('Found post:', {
      postId: post._id,
      currentScore: post.score,
      currentUpvotes: post.upvotes,
      currentDownvotes: post.downvotes
    });

    // Ensure arrays exist
    if (!Array.isArray(post.upvotes)) post.upvotes = [];
    if (!Array.isArray(post.downvotes)) post.downvotes = [];
    if (typeof post.score !== 'number') post.score = 0;

    const userId = new mongoose.Types.ObjectId(req.user.id);
    const userIdStr = userId.toString();

    // Check if user has already downvoted
    const hasUpvoted = post.upvotes.some(id => id.toString() === userIdStr);
    const hasDownvoted = post.downvotes.some(id => id.toString() === userIdStr);

    console.log('Vote status:', {
      hasUpvoted,
      hasDownvoted,
      userIdStr
    });

    if (hasDownvoted) {
      // Remove downvote
      post.downvotes = post.downvotes.filter(id => id.toString() !== userIdStr);
      post.score += 1;
    } else {
      // Add downvote
      post.downvotes.push(userId);
      post.score -= 1;
      
      // Remove upvote if exists
      if (hasUpvoted) {
        post.upvotes = post.upvotes.filter(id => id.toString() !== userIdStr);
        post.score -= 1; // Compensate for removing upvote
      }
    }

    console.log('Updated post:', {
      newScore: post.score,
      newUpvotes: post.upvotes,
      newDownvotes: post.downvotes
    });

    const updatedPost = await post.save();
    console.log('Saved post:', updatedPost);
    res.json(updatedPost);
  } catch (error) {
    console.error('Error in downVotePost:', {
      error: error.message,
      stack: error.stack,
      postId: req.params.id,
      userId: req.user?.id
    });
    res.status(500).json({ message: 'Error updating vote', error: error.message });
  }
};

// GET /api/posts/:id
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate({
        path: 'comments',
        select: 'text username createdAt',
        options: { sort: { createdAt: 1 } }
      });
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    // Return a structure matching frontend expectations
    res.status(200).json({
      _id: post._id,
      title: post.title,
      content: post.content,
      author: post.username,
      score: post.score,
      upvotes: post.upvotes,
      downvotes: post.downvotes,
      comments: post.comments.map(comment => ({
        _id: comment._id,
        username: comment.username,
        text: comment.text,
        createdAt: comment.createdAt
      })),
      createdAt: post.createdAt,
      updatedAt: post.updatedAt
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


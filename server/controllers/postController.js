// controllers/postController.js
import Post from '../model/Post.js';


// GET /api/posts
export const getPosts = async (req, res) => {
  try{
    const posts = await Post.find();
    res.status(200).json(posts);
  }catch(err){
    res.status(500).json({message:err})
  }
};

// POST /api/posts
export const createPost = async (req, res) => {
  try{
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
    res.status(201).json({title,content});
  }catch(err){
    res.status(500).json({message:err.message});
  }
};

export const deletePost = async (req,res)=>{
  try{
    const { id } = req.params;
    const deletedPost = await Post.findByIdAndDelete(id);
    if (!deletedPost) {
      return res.status(404).json({ message: "Post not found" }); 
    }
    res.status(200).json({ message: "Post deleted" });
 
  }catch(err){
    res.status(500).json({message:err.message})
  }
}

export const updatePost = async(req,res)=>{
  try{
    const { id } = req.params; // get post ID from the URL
    const updates = req.body; // get updated fields (title/content/author)
    // ✅ Try using Mongoose's findByIdAndUpdate here
    const updatedPost = await Post.findByIdAndUpdate(id,updates,{new:true});
    // ⚠️ Remember to set { new: true } so it returns the updated document
    if(!updatedPost) return res.status(404).json({message:"Post not found"})
    // ⛔ Handle case: post not found
    // ✅ Return: updated post or success message
    res.status(200).json({success:true,data:updatedPost})
  }catch(err){
    res.status(500).json({message:err.message});
  }
}

export const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const userId = req.user.id;

    // 🛠 Ensure likes array exists
    if (!post.likes) post.likes = [];

    // 💡 Toggle like: remove if already liked, otherwise add
    const alreadyLiked = post.likes.includes(userId);

    if (alreadyLiked) {
      post.likes = post.likes.filter(id => id.toString() !== userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();
    res.status(200).json(post);
  } catch (err) {
    console.error("Error in likePost:", err); // ✅ for debugging
    res.status(500).json({ message: "Error updating like" });
  }
};

export const addComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const { text } = req.body;

    // Ensure the post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Create a new comment
    const newComment = {
      text,
      user: req.user._id,  // Use the authenticated user's ID
      createdAt: new Date(),
      username: req.user.username, // Pass the username of the user who is commenting
      author: {
        id: req.user._id, // This should be the same user who is commenting
      },
    };

    post.comments.push(newComment);
    await post.save();
    
    res.status(201).json(post);  // Return the updated post
  } catch (err) {
    console.error('Error adding comment:', err);  // Add logging to see the error in the backend
    res.status(500).json({ message: 'Failed to add comment', error: err.message });
  }
};

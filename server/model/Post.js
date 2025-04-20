// models/Post.js
import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: {type :String, required : true},
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
  },
  username: {
  type: String,
  required: true
  },
  image:String,
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments :[{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  }
],
}, 
{ timestamps: true });

const Post = mongoose.model('Post', postSchema);

export default Post;

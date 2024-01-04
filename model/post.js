const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  photos: [{
    type: String,
  }],
  videos: [{
    type: String,
  }],
 
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;

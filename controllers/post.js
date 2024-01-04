const fs = require('fs'); 
const path = require('path');
const upload = require('../index')
const Post = require('../model/post');
const mongoose = require('mongoose');
const User = require('../model/user');

exports.createPost = async (req, res) => {
    try {
        const { userId, title, content, photos, videos } = req.body;

        // Validate that required fields are provided
        if (!userId || !title || !content) {
            return res.status(400).json({ error: 'UserId, title, and content are required fields.' });
        }

        // checking if the user with the provided userId exists
        const userExists = await User.exists({ _id: userId });
        if (!userExists) {
            return res.status(404).json({ error: 'User not found.' });
        }

        // creating a new post instance
        const post = new Post({
            user: userId,
            title,
            content,
            photos,
            videos,
        });

        // save the post to the database
        const savedPost = await post.save();

        console.log('Post inserted successfully:', savedPost);

        // respond with the saved post details
        res.status(201).json(savedPost);
    } catch (error) {
        console.error('Error inserting post:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.fetchLatestPost = async (req, res) => {
    try {
        // Finding the latest posts sorted by createdAt in descending order
        const latestPosts = await Post.find()
            .sort({ createdAt: -1 })
            .limit(5);

        // Respond with the latest posts
        res.status(200).json(latestPosts);
    } catch (error) {
        console.error('Error fetching latest posts:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

  exports.updatePost = async (req, res) => {
    try {
        const postId = req.params.postId;

        // validating that the postId is a valid ObjectId
        if (!mongoose.isValidObjectId(postId)) {
            return res.status(400).json({ error: 'Invalid postId format.' });
        }

        // find the post by ID
        const post = await Post.findById(postId);

        // checking if the post exists
        if (!post) {
            return res.status(404).json({ error: 'Post not found.' });
        }

        // update post properties
        if (req.body.title) {
            post.title = req.body.title;
        }
        if (req.body.content) {
            post.content = req.body.content;
        }

        // save the updated post to the database
        const updatedPost = await post.save();

        // respond with the updated post details
        res.status(200).json(updatedPost);
    } catch (error) {
        console.error('Error updating post:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.deletePost = async (req, res) => {
    try {
        const postId = req.params.postId;

        // validating that the postId is a valid ObjectId
        if (!mongoose.isValidObjectId(postId)) {
            return res.status(400).json({ error: 'Invalid postId format.' });
        }

        // find the post by ID and delete it
        const deletedPost = await Post.findByIdAndDelete(postId);

        // checking if the post exists
        if (!deletedPost) {
            return res.status(404).json({ error: 'Post not found.' });
        }

        // respond with a success message
        res.status(200).json({ message: 'Post deleted successfully.' });
    } catch (error) {
        console.error('Error deleting post:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
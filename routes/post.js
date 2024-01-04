const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const postController = require('../controllers/post');  
const Post = require('../model/post');


const{
    createPost,
    fetchLatestPost,
    updatePost,
    deletePost,
} = require('../controllers/post');


//posting route
router.post('/posts', createPost);

// route to handle fetching the latest 5 posts
router.get('/posts/latest', fetchLatestPost);

// Route to handle updating a post by ID
router.put('/posts/:postId', updatePost);


// route to handle deleting a post by ID
router.delete('/posts/:postId', deletePost);

module.exports = router;


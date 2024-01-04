// routes/upload.js
const express = require('express');
const uploadController = require('../controllers/upload');
const router = express.Router();

// Handle photo upload
router.post('/upload', uploadController.uploadPhoto);

module.exports = router;

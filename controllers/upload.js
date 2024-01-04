// controllers/upload.js
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const Upload = require('../model/upload');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage }).single('photo');

const uploadPhoto = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error('Error uploading file:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    // File details
    const { filename, path } = req.file;

    // Save upload details to the database
    const upload = new Upload({ filename, path });
    await upload.save();

    // Respond with the uploaded file details
    res.status(201).json(upload);
  });
};

module.exports = { uploadPhoto };

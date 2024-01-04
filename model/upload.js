const mongoose = require('mongoose');

const uploadSchema = new mongoose.Schema({
  filename: String,
  path: String,
});

const Upload = mongoose.model('Upload', uploadSchema);

module.exports = Upload;

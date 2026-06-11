const express = require('express');
const router = express.Router();
const { auth } = require('../middlewares/auth');
const { upload } = require('../config/cloudinary');
const controlPlane = require('../middlewares/neuralcontrol');

// POST /api/upload
// Expects a form-data payload with a field named "image"
router.post('/', auth, controlPlane.middleware("/api/upload", { priority: "medium" }), upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    // req.file.path contains the secure URL returned by Cloudinary
    return res.status(200).json({
      success: true,
      imageUrl: req.file.path, 
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Image upload failed',
      error: error.message,
    });
  }
});

module.exports = router;

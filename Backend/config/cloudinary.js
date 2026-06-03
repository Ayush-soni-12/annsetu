const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer storage to use Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'annsetu-donations', // The folder name in your Cloudinary account
    allowedFormats: ['jpeg', 'png', 'jpg', 'webp'],
    transformation: [{ width: 800, crop: 'limit' }], // auto compress/resize
  },
});

const upload = multer({ storage: storage });

module.exports = { cloudinary, upload };

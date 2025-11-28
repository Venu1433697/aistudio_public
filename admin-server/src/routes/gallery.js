const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const { getAllGallery, uploadImage, updateImage, deleteImage } = require('../controllers/galleryController');

// multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', '..', 'uploads', 'gallery'));
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

router.get('/', auth, getAllGallery);
router.post('/', auth, upload.single('image'), uploadImage);
router.put('/:id', auth, updateImage);
router.delete('/:id', auth, deleteImage);

module.exports = router;

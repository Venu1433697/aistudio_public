const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/auth');
const { getProfile, updateProfile, uploadProfileImage, uploadBannerImage, deleteProfileImage, deleteBannerImage } = require('../controllers/adminController');

// Multer storage for profile images
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const folder = req.path.includes('banner') ? 'banners' : 'profiles';
        cb(null, path.join(__dirname, '..', '..', 'uploads', folder));
    },
    filename: function (req, file, cb) {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, unique + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

router.get('/', auth, getProfile);
router.put('/', auth, updateProfile);
router.post('/upload-profile-image', auth, upload.single('image'), uploadProfileImage);
router.post('/upload-banner-image', auth, upload.single('image'), uploadBannerImage);
router.delete('/profile-image', auth, deleteProfileImage);
router.delete('/banner-image', auth, deleteBannerImage);

module.exports = router;

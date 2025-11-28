const express = require('express');
const router = express.Router();
const { login, logout, sessionStatus } = require('../controllers/authController');
const auth = require('../middleware/auth');

router.post('/login', login); // Changed from '/' to '/login' to match spec
router.post('/logout', logout);
router.get('/session-status', auth, sessionStatus);

module.exports = router;

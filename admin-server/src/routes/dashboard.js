const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getUserStats, getVisitorStats, getActiveUserStats } = require('../controllers/dashboardController');

router.get('/stats/users', auth, getUserStats);
router.get('/stats/visitors', auth, getVisitorStats);
router.get('/stats/active-users', auth, getActiveUserStats);

module.exports = router;

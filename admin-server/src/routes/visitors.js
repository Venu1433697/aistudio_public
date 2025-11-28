const express = require('express');
const router = express.Router();
const { trackVisitor, getVisitorCount, getActiveVisitors } = require('../controllers/visitorController');

router.post('/track', trackVisitor);
router.get('/count', getVisitorCount);
router.get('/active', getActiveVisitors);

module.exports = router;

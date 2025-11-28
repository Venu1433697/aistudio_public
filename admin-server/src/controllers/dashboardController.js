const User = require('../models/User');
const Visitor = require('../models/Visitor');

async function getUserStats(req, res) {
    try {
        const count = await User.countDocuments({});
        res.json({ totalUsers: count });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
}

async function getVisitorStats(req, res) {
    try {
        // Assuming Visitor model tracks unique visitors
        const count = await Visitor.countDocuments({});
        res.json({ totalVisitors: count });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
}

async function getActiveUserStats(req, res) {
    try {
        // Active users in the last 5 minutes
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        const count = await User.countDocuments({ lastActive: { $gte: fiveMinutesAgo } });
        res.json({ activeUsers: count });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
}

module.exports = { getUserStats, getVisitorStats, getActiveUserStats };

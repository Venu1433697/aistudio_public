const Visitor = require('../models/Visitor');

async function trackVisitor(req, res) {
    try {
        const ipAddress = req.ip || req.connection.remoteAddress || 'unknown';
        const userAgent = req.headers['user-agent'] || '';
        const { email } = req.body;

        // Find or create visitor
        const visitor = await Visitor.findOneAndUpdate(
            { $or: [{ ipAddress }, email ? { email } : {}] },
            {
                $set: { lastVisit: new Date(), userAgent },
                $setOnInsert: { email: email || '', ipAddress },
                $inc: { visitCount: 1 }
            },
            { upsert: true, new: true }
        );

        res.json({ success: true, visitor });
    } catch (error) {
        console.error('Visitor tracking error:', error);
        res.status(500).json({ message: 'Failed to track visitor' });
    }
}

async function getVisitorCount(req, res) {
    try {
        const count = await Visitor.countDocuments();
        res.json({ count });
    } catch (error) {
        console.error('Get visitor count error:', error);
        res.status(500).json({ message: 'Failed to get visitor count' });
    }
}

module.exports = { trackVisitor, getVisitorCount };

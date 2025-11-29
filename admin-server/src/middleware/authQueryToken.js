const jwt = require('jsonwebtoken');

// Authentication middleware that accepts token from query parameter
// Used for file serving endpoints where token can't be in header (e.g., iframe src)
const authQueryToken = (req, res, next) => {
    const token = req.query.token;
    if (!token) return res.status(401).json({ message: 'No token provided' });

    try {
        const secret = process.env.JWT_SECRET || 'dev_secret_change_this';
        const payload = jwt.verify(token, secret);
        req.admin = { id: payload.id, email: payload.email };
        return next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = authQueryToken;

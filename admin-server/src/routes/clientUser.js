const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');

// Middleware to verify token
const auth = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (e) {
        res.status(400).json({ message: 'Token is not valid' });
    }
};

// Get Profile
router.get('/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-mpin');
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Update Profile
router.put('/profile', auth, async (req, res) => {
    const { name, companyName, email, mobile, profileImage } = req.body;

    try {
        let user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (name) {
            user.name = name;
            user.firstName = name.split(' ')[0];
            user.lastName = name.split(' ').slice(1).join(' ') || '';
        }
        user.companyName = companyName || user.companyName;
        user.email = email || user.email;
        user.mobile = mobile || user.mobile;
        user.profileImage = profileImage || user.profileImage;

        await user.save();
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Reset M-Pin (Authenticated - via Old M-Pin)
router.post('/reset-mpin', auth, async (req, res) => {
    const { oldMpin, newMpin } = req.body;

    // Validation Helper (Duplicated for now, could be shared)
    const validateMpin = (mpin) => {
        if (!/^\d{4}$/.test(mpin)) return false;
        for (let i = 0; i < mpin.length - 1; i++) {
            if (Math.abs(parseInt(mpin[i]) - parseInt(mpin[i + 1])) === 1) return false;
        }
        for (let i = 0; i < mpin.length - 1; i++) {
            if (mpin[i] === mpin[i + 1]) return false;
        }
        return true;
    };

    if (!validateMpin(newMpin)) {
        return res.status(400).json({ message: 'Invalid M-Pin format.' });
    }

    try {
        const user = await User.findById(req.user.id);
        const isMatch = await bcrypt.compare(oldMpin, user.mpin);
        if (!isMatch) return res.status(400).json({ message: 'Incorrect old M-Pin' });

        const salt = await bcrypt.genSalt(10);
        user.mpin = await bcrypt.hash(newMpin, salt);
        await user.save();

        res.json({ message: 'M-Pin updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Delete Profile
router.delete('/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        await User.findByIdAndDelete(req.user.id);
        res.json({ message: 'Profile deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// --- Client Billing APIs ---

// Get Full Billing Summary
router.get('/billing', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('billing billingEnabled');
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (!user.billingEnabled) {
            return res.json({
                status: 'No project assigned yet',
                billingEnabled: false,
                totalCost: 0,
                paidAmount: 0,
                pendingAmount: 0
            });
        }

        const totalCost = user.billing.totalCost || 0;
        const paidAmount = user.billing.paidAmount || 0;
        const pendingAmount = totalCost - paidAmount;

        res.json({
            status: 'Active',
            billingEnabled: true,
            totalCost,
            paidAmount,
            pendingAmount,
            // Include other details if needed, or keep it summary only
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Get Project Tracker
router.get('/billing/tracker', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('billing.timeline billingEnabled');
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (!user.billingEnabled) return res.json([]);

        res.json(user.billing.timeline || []);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Get Invoices
router.get('/billing/invoices', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('billing.invoices billingEnabled');
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (!user.billingEnabled) return res.json([]);

        res.json(user.billing.invoices || []);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Get Payments
router.get('/billing/payments', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('billing.payments billingEnabled');
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (!user.billingEnabled) return res.json([]);

        res.json(user.billing.payments || []);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Middleware to verify token from query parameter (for file viewing)
const authQueryToken = require('../middleware/authQueryToken');

// View/Download Invoice
router.get('/billing/invoices/:invoiceId/view', authQueryToken, async (req, res) => {
    try {
        const user = await User.findById(req.admin.id).select('billing.invoices');
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Find the invoice in user's billing.invoices array
        const invoice = user.billing.invoices.find(inv => inv._id.toString() === req.params.invoiceId);

        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }

        let filePath;

        // Check if the stored path is absolute (starts with / or C:\ etc)
        // We check this manually because path.isAbsolute can be tricky with mixed separators
        const isAbsolute = invoice.filepath.startsWith('/') || invoice.filepath.match(/^[a-zA-Z]:\\/) || invoice.filepath.match(/^[a-zA-Z]:\//);

        if (isAbsolute && fs.existsSync(invoice.filepath)) {
            filePath = invoice.filepath;
        } else {
            // Try resolving relative to project root
            const relativePath = path.join(__dirname, '../../', invoice.filepath);
            if (fs.existsSync(relativePath)) {
                filePath = relativePath;
            } else if (fs.existsSync(invoice.filepath)) {
                // Fallback: check raw path again even if it didn't look absolute
                filePath = invoice.filepath;
            } else {
                return res.status(404).json({ message: 'Invoice file not found on server' });
            }
        }

        // Send the file
        res.sendFile(filePath);
    } catch (err) {
        console.error('Error viewing invoice:', err);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;

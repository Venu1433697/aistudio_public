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

module.exports = router;

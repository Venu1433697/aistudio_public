const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Validation Helper
const validateMpin = (mpin) => {
    if (!/^\d{4}$/.test(mpin)) return false;

    // Check for sequential adjacent digits (e.g., 12, 67, 34)
    for (let i = 0; i < mpin.length - 1; i++) {
        if (Math.abs(parseInt(mpin[i]) - parseInt(mpin[i + 1])) === 1) return false;
    }

    // Check for duplicate adjacent digits (e.g., 44, 77)
    for (let i = 0; i < mpin.length - 1; i++) {
        if (mpin[i] === mpin[i + 1]) return false;
    }

    return true;
};

// Sign Up
router.post('/signup', async (req, res) => {
    const { name, companyName, email, mobile, mpin } = req.body;

    if (!name || !email || !mobile || !mpin) {
        return res.status(400).json({ message: 'Please enter all fields' });
    }

    if (!validateMpin(mpin)) {
        return res.status(400).json({ message: 'Invalid M-Pin. Must be 4 digits, no sequential or duplicate adjacent numbers.' });
    }

    try {
        let user = await User.findOne({ mobile });
        if (user) return res.status(400).json({ message: 'User already exists with this mobile number' });

        user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'User already exists with this email' });

        const salt = await bcrypt.genSalt(10);
        const hashedMpin = await bcrypt.hash(mpin, salt);

        // Note: firstName is required in schema, so we map name to firstName as well if needed
        // But we made name optional in schema update? No, I added name field.
        // But firstName is REQUIRED in schema.
        // So I must provide firstName. I'll use 'name' for firstName.

        user = new User({
            firstName: name.split(' ')[0],
            lastName: name.split(' ').slice(1).join(' ') || '',
            name,
            companyName,
            email,
            mobile,
            mpin: hashedMpin
        });

        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

        res.status(201).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                mobile: user.mobile,
                companyName: user.companyName,
                profileImage: user.profileImage
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Login
router.post('/login', async (req, res) => {
    const { mobile, mpin } = req.body;

    if (!mobile || !mpin) {
        return res.status(400).json({ message: 'Please enter all fields' });
    }

    try {
        const user = await User.findOne({ mobile });
        if (!user) return res.status(400).json({ message: 'User does not exist' });

        const isMatch = await bcrypt.compare(mpin, user.mpin);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name || (user.firstName + ' ' + user.lastName),
                email: user.email,
                mobile: user.mobile,
                companyName: user.companyName,
                profileImage: user.profileImage
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Forgot M-Pin (Verify Mobile)
router.post('/forgot-mpin-verify', async (req, res) => {
    const { mobile } = req.body;

    try {
        const user = await User.findOne({ mobile });
        if (!user) return res.status(404).json({ message: 'Mobile number not found' });

        res.json({ message: 'Mobile number verified', mobile });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Reset M-Pin (Unauthenticated - via Forgot M-Pin flow)
router.post('/reset-mpin-unauth', async (req, res) => {
    const { mobile, newMpin } = req.body;

    if (!validateMpin(newMpin)) {
        return res.status(400).json({ message: 'Invalid M-Pin format.' });
    }

    try {
        const user = await User.findOne({ mobile });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const salt = await bcrypt.genSalt(10);
        user.mpin = await bcrypt.hash(newMpin, salt);
        await user.save();

        res.json({ message: 'M-Pin updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;

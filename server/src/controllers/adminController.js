const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');

async function getProfile(req, res) {
  const admin = await Admin.findById(req.admin.id, '-password').lean();
  if (!admin) return res.status(404).json({ message: 'Admin not found' });
  res.json(admin);
}

async function updateProfile(req, res) {
  const updates = {};
  const allowed = ['firstName', 'lastName', 'mobile', 'email', 'gender'];
  allowed.forEach((k) => { if (req.body[k] !== undefined) updates[k] = req.body[k]; });

  if (updates.email) updates.email = updates.email.toLowerCase().trim();

  // If email changed, ensure uniqueness
  if (updates.email) {
    const exists = await Admin.findOne({ email: updates.email, _id: { $ne: req.admin.id } });
    if (exists) return res.status(409).json({ message: 'Email already in use by another admin' });
  }

  const admin = await Admin.findByIdAndUpdate(req.admin.id, updates, { new: true, select: '-password' });
  if (!admin) return res.status(404).json({ message: 'Admin not found' });
  res.json(admin);
}

module.exports = { getProfile, updateProfile };

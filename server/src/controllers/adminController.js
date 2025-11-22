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

async function uploadProfileImage(req, res) {
  if (!req.file) return res.status(400).json({ message: 'Image file required' });

  const url = `/uploads/profiles/${req.file.filename}`;
  const admin = await Admin.findByIdAndUpdate(
    req.admin.id,
    { profileImage: url },
    { new: true, select: '-password' }
  );

  if (!admin) return res.status(404).json({ message: 'Admin not found' });
  res.json(admin);
}

async function uploadBannerImage(req, res) {
  if (!req.file) return res.status(400).json({ message: 'Image file required' });

  const url = `/uploads/banners/${req.file.filename}`;
  const admin = await Admin.findByIdAndUpdate(
    req.admin.id,
    { bannerImage: url },
    { new: true, select: '-password' }
  );

  if (!admin) return res.status(404).json({ message: 'Admin not found' });
  res.json(admin);
}

async function deleteProfileImage(req, res) {
  const admin = await Admin.findByIdAndUpdate(
    req.admin.id,
    { profileImage: '' },
    { new: true, select: '-password' }
  );

  if (!admin) return res.status(404).json({ message: 'Admin not found' });
  res.json(admin);
}

async function deleteBannerImage(req, res) {
  const admin = await Admin.findByIdAndUpdate(
    req.admin.id,
    { bannerImage: '' },
    { new: true, select: '-password' }
  );

  if (!admin) return res.status(404).json({ message: 'Admin not found' });
  res.json(admin);
}

module.exports = { getProfile, updateProfile, uploadProfileImage, uploadBannerImage, deleteProfileImage, deleteBannerImage };

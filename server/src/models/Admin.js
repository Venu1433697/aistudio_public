const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
  firstName: { type: String, default: 'Admin' },
  lastName: { type: String, default: '' },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mobile: { type: String, default: '' },
  gender: { type: String, enum: ['male', 'female', 'other', ''], default: '' },
  profileImage: { type: String, default: '' },
  bannerImage: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Admin', AdminSchema);

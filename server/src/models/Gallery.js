const mongoose = require('mongoose');

const GallerySchema = new mongoose.Schema({
  url: { type: String, required: true },
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Gallery', GallerySchema);

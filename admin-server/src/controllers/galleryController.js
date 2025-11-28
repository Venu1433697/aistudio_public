const Gallery = require('../models/Gallery');
const path = require('path');

async function getAllGallery(req, res) {
  const items = await Gallery.find({}).lean();
  res.json(items);
}

async function uploadImage(req, res) {
  if (!req.file) return res.status(400).json({ message: 'Image file required' });
  const url = `/uploads/gallery/${req.file.filename}`;
  const { title = '', description = '' } = req.body;
  const item = new Gallery({ url, title, description });
  await item.save();
  res.status(201).json(item);
}

async function updateImage(req, res) {
  const id = req.params.id;
  const updates = {};
  const allowed = ['title', 'description', 'url'];
  allowed.forEach((k) => { if (req.body[k] !== undefined) updates[k] = req.body[k]; });
  const item = await Gallery.findByIdAndUpdate(id, updates, { new: true });
  if (!item) return res.status(404).json({ message: 'Image not found' });
  res.json(item);
}

async function deleteImage(req, res) {
  const id = req.params.id;
  const item = await Gallery.findByIdAndDelete(id);
  if (!item) return res.status(404).json({ message: 'Image not found' });
  res.json({ message: 'Deleted' });
}

module.exports = { getAllGallery, uploadImage, updateImage, deleteImage };

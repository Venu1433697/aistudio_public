const User = require('../models/User');

async function getAllUsers(req, res) {
  const users = await User.find({}, 'firstName lastName mobile email age').lean();
  res.json(users);
}

async function createUser(req, res) {
  const { firstName, lastName, mobile, email, age } = req.body;
  if (!firstName || !email) return res.status(400).json({ message: 'firstName and email required' });

  const exists = await User.findOne({ email: email.toLowerCase().trim() });
  if (exists) return res.status(409).json({ message: 'Email already exists' });

  const user = new User({ firstName, lastName, mobile, email: email.toLowerCase().trim(), age });
  await user.save();
  res.status(201).json(user);
}

async function updateUser(req, res) {
  const id = req.params.id;
  const updates = req.body;
  if (updates.email) updates.email = updates.email.toLowerCase().trim();

  const user = await User.findByIdAndUpdate(id, updates, { new: true });
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
}

async function deleteUser(req, res) {
  const id = req.params.id;
  const user = await User.findByIdAndDelete(id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ message: 'Deleted' });
}

module.exports = { getAllUsers, createUser, updateUser, deleteUser };

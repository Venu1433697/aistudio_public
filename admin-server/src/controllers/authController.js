const Admin = require('../models/Admin');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

  const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
  if (!admin) return res.status(401).json({ message: 'Invalid credentials' });

  const match = await bcrypt.compare(password, admin.password);
  if (!match) return res.status(401).json({ message: 'Invalid credentials' });

  const secret = process.env.JWT_SECRET || 'dev_secret_change_this';
  const token = jwt.sign({ id: admin._id, email: admin.email }, secret, { expiresIn: '24h' });

  // Fetch users (firstName, lastName, mobile, email, age)
  const users = await User.find({}, 'firstName lastName mobile email age').lean();

  res.json({ token, admin: { id: admin._id, firstName: admin.firstName, lastName: admin.lastName, email: admin.email, mobile: admin.mobile, gender: admin.gender }, users });
}

async function logout(req, res) {
  // Since we are using JWT, we can't invalidate the token server-side without a blacklist.
  // For now, we just send a success response and the client will remove the token.
  res.json({ message: 'Logged out successfully' });
}

async function sessionStatus(req, res) {
  // If the request reaches here, the auth middleware has already validated the token.
  // So the session is valid.
  res.json({ valid: true, user: req.user });
}

module.exports = { login, logout, sessionStatus };

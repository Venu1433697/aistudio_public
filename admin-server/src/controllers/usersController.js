const User = require('../models/User');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

async function getAllUsers(req, res) {
  const users = await User.find({}, 'firstName lastName mobile email age').lean();
  res.json(users);
}

async function getUserById(req, res) {
  const id = req.params.id;
  const user = await User.findById(id).lean();
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
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

// Enable billing for a user (irreversible operation)
async function enableBilling(req, res) {
  const id = req.params.id;
  const { adminEmail } = req.body;

  if (!adminEmail) {
    return res.status(400).json({ message: 'Admin email is required' });
  }

  const user = await User.findById(id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  // Check if already enabled
  if (user.billingEnabled) {
    return res.status(400).json({
      message: 'Billing already enabled for this user',
      enabledBy: user.billingEnabledBy,
      enabledAt: user.billingEnabledAt
    });
  }

  // Enable billing (irreversible)
  user.billingEnabled = true;
  user.billingEnabledBy = adminEmail;
  user.billingEnabledAt = new Date();
  await user.save();

  res.json(user);
}

// Get all users with billing enabled
async function getBillingUsers(req, res) {
  const users = await User.find(
    { billingEnabled: true },
    'firstName lastName email mobile billingEnabled billingEnabledBy billingEnabledAt billing'
  ).lean();
  res.json(users);
}

// Update billing details for a user
async function updateBillingDetails(req, res) {
  const id = req.params.id;
  const { totalCost, paidAmount } = req.body;

  const user = await User.findById(id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  if (!user.billingEnabled) {
    return res.status(400).json({ message: 'Billing not enabled for this user' });
  }

  // Update billing details
  user.billing.totalCost = totalCost || 0;
  user.billing.paidAmount = paidAmount || 0;

  await user.save();
  res.json(user);
}

// Delete billing details
async function deleteBillingDetails(req, res) {
  const id = req.params.id;
  const user = await User.findById(id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  user.billingEnabled = false;
  user.billingEnabledBy = null;
  user.billingEnabledAt = null;
  user.billing = {
    totalCost: 0,
    paidAmount: 0,
    timeline: [],
    payments: [],
    invoices: []
  };

  await user.save();
  res.json({ message: 'Billing details deleted' });
}

// --- Project Tracker ---

async function getTracker(req, res) {
  const id = req.params.id;
  const user = await User.findById(id, 'billing.timeline').lean();
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user.billing?.timeline || []);
}

async function addTrackerPhase(req, res) {
  const id = req.params.id;
  const { name, date, status } = req.body;

  const user = await User.findById(id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  if (!user.billingEnabled) return res.status(400).json({ message: 'Billing not enabled' });

  user.billing.timeline.push({ name, date, status: status || 'Soon' });
  await user.save();
  res.json(user.billing.timeline);
}

async function updateTrackerPhase(req, res) {
  const { id, trackerId } = req.params;
  const { name, date, status } = req.body;

  const user = await User.findById(id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const phase = user.billing.timeline.id(trackerId);
  if (!phase) return res.status(404).json({ message: 'Phase not found' });

  if (name) phase.name = name;
  if (date) phase.date = date;
  if (status) phase.status = status;

  await user.save();
  res.json(phase);
}

async function deleteTrackerPhase(req, res) {
  const { id, trackerId } = req.params;

  const user = await User.findById(id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  user.billing.timeline.pull(trackerId);
  await user.save();
  res.json({ message: 'Phase deleted' });
}

// Upload invoice for a user
async function uploadInvoicePDF(req, res) {
  const id = req.params.id;
  const { adminEmail } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const user = await User.findById(id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  if (!user.billingEnabled) {
    return res.status(400).json({ message: 'Billing not enabled for this user' });
  }

  // Add invoice to user's billing details
  user.billing.invoices.push({
    filename: req.file.originalname,
    filepath: req.file.path,
    uploadDate: new Date(),
    uploadedBy: adminEmail || 'Unknown'
  });

  await user.save();
  res.json(user);
}

async function replaceInvoice(req, res) {
  const { id, invoiceId } = req.params;
  const { adminEmail } = req.body;
  const fs = require('fs');

  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

  const user = await User.findById(id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const invoice = user.billing.invoices.id(invoiceId);
  if (!invoice) return res.status(404).json({ message: 'Invoice not found' });

  // Delete old file
  if (fs.existsSync(invoice.filepath)) {
    fs.unlinkSync(invoice.filepath);
  }

  // Update invoice details
  invoice.filename = req.file.originalname;
  invoice.filepath = req.file.path;
  invoice.uploadDate = new Date();
  invoice.uploadedBy = adminEmail || 'Unknown';

  await user.save();
  res.json(user);
}

// Get all invoices for a user
async function getInvoices(req, res) {
  const id = req.params.id;
  const user = await User.findById(id, 'billing.invoices').lean();
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user.billing?.invoices || []);
}

// Delete an invoice
async function deleteInvoice(req, res) {
  const { id, invoiceId } = req.params;
  const fs = require('fs');

  const user = await User.findById(id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const invoice = user.billing.invoices.id(invoiceId);
  if (!invoice) return res.status(404).json({ message: 'Invoice not found' });

  // Delete file from filesystem
  if (fs.existsSync(invoice.filepath)) {
    fs.unlinkSync(invoice.filepath);
  }

  // Remove from database
  user.billing.invoices.pull(invoiceId);
  await user.save();

  res.json({ message: 'Invoice deleted successfully' });
}

// Update project progress
async function updateProgress(req, res) {
  const id = req.params.id;
  const { status, percentage, milestones, adminEmail } = req.body;

  const user = await User.findById(id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  if (!user.billingEnabled) {
    return res.status(400).json({ message: 'Billing not enabled for this user' });
  }

  // Ensure projectProgress object exists
  if (!user.billing.projectProgress) {
    user.billing.projectProgress = {
      status: 'Not Started',
      percentage: 0,
      milestones: []
    };
  }

  // Update progress fields
  if (status !== undefined) user.billing.projectProgress.status = status;
  if (percentage !== undefined) user.billing.projectProgress.percentage = percentage;
  if (milestones !== undefined) user.billing.projectProgress.milestones = milestones;

  user.billing.projectProgress.lastUpdated = new Date();
  user.billing.projectProgress.updatedBy = adminEmail || 'Unknown';

  await user.save();
  res.json(user);
}

// View Invoice (Serve PDF)
async function viewInvoice(req, res) {
  const { id, invoiceId } = req.params;

  const user = await User.findById(id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const invoice = user.billing.invoices.id(invoiceId);
  if (!invoice) return res.status(404).json({ message: 'Invoice not found' });

  if (!fs.existsSync(invoice.filepath)) {
    return res.status(404).json({ message: 'File not found on server' });
  }

  res.contentType('application/pdf');
  res.sendFile(path.resolve(invoice.filepath));
}

// Get Billing Details (Admin)
async function getBillingDetails(req, res) {
  const id = req.params.id;
  const user = await User.findById(id).select('billing billingEnabled billingEnabledBy billingEnabledAt');
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
}

// Reset User MPIN (Admin)
async function resetUserMpin(req, res) {
  const id = req.params.id;
  const { newMpin } = req.body;

  if (!newMpin || !/^\d{4}$/.test(newMpin)) {
    return res.status(400).json({ message: 'Invalid MPIN format. Must be 4 digits.' });
  }

  const user = await User.findById(id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const salt = await bcrypt.genSalt(10);
  user.mpin = await bcrypt.hash(newMpin, salt);
  await user.save();

  res.json({ message: 'MPIN reset successfully' });
}

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  enableBilling,
  getBillingUsers,
  updateBillingDetails,
  uploadInvoicePDF,
  getInvoices,
  deleteInvoice,
  updateProgress,
  deleteBillingDetails,
  getTracker,
  addTrackerPhase,
  updateTrackerPhase,
  deleteTrackerPhase,
  deleteTrackerPhase,
  replaceInvoice,
  viewInvoice,
  getBillingDetails,
  resetUserMpin
};

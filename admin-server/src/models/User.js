const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, default: '' },
  mobile: { type: String, default: '' },
  email: { type: String, required: true, unique: true },
  age: { type: Number, default: null },
  createdAt: { type: Date, default: Date.now },

  // Website User Fields
  name: { type: String },
  companyName: { type: String },
  mpin: { type: String },
  profileImage: { type: String, default: '' },
  lastActive: { type: Date, default: Date.now }, // Track active users

  // Consolidated Billing & Project Tracker
  billing: {
    // Billing Info
    totalCost: { type: Number, default: 0 },
    paidAmount: { type: Number, default: 0 },
    // pendingDue/remainingAmount can be calculated, but storing for query ease if needed. 
    // We'll rely on totalCost - paidAmount in logic, or keep a field if preferred.
    // Let's keep it simple and consistent with previous "billingDetails"

    // Project Tracker (Dynamic Array)
    timeline: [{
      name: { type: String, required: true }, // e.g. "Site Inspection"
      date: { type: String, default: '' },
      status: { type: String, enum: ['Done', 'In Progress', 'Soon'], default: 'Soon' }
    }],

    // Payments History
    payments: [{
      mode: { type: String, enum: ['UPI', 'Net Banking', 'Cheque', 'Cash'] },
      date: String,
      description: String,
      amount: Number,
      status: { type: String, default: 'Paid' }
    }],

    // Invoices
    invoices: [{
      number: String, // Sequence number or ID
      filename: String,
      filepath: String,
      uploadDate: { type: Date, default: Date.now },
      uploadedBy: String
    }]
  },

  // Flags
  billingEnabled: { type: Boolean, default: false },
  billingEnabledBy: { type: String, default: null },
  billingEnabledAt: { type: Date, default: null }
});

module.exports = mongoose.model('User', UserSchema);

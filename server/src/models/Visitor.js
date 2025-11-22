const mongoose = require('mongoose');

const VisitorSchema = new mongoose.Schema({
    email: { type: String, default: '' },
    ipAddress: { type: String, required: true },
    userAgent: { type: String, default: '' },
    lastVisit: { type: Date, default: Date.now },
    visitCount: { type: Number, default: 1 }
});

// Create compound index for unique visitors (email or IP)
VisitorSchema.index({ email: 1, ipAddress: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('Visitor', VisitorSchema);

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure invoices directory exists
const invoicesDir = path.join(__dirname, '../../uploads/invoices');
if (!fs.existsSync(invoicesDir)) {
    fs.mkdirSync(invoicesDir, { recursive: true });
}

// Configure storage for invoices
const invoiceStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, invoicesDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'invoice-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter to accept only PDFs
const pdfFilter = function (req, file, cb) {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Only PDF files are allowed!'), false);
    }
};

// Create multer instance for invoice uploads
const uploadInvoice = multer({
    storage: invoiceStorage,
    fileFilter: pdfFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});

module.exports = { uploadInvoice };

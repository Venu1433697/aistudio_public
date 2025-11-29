const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authQueryToken = require('../middleware/authQueryToken');
const { uploadInvoice } = require('../middleware/uploadInvoice');
const {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    enableBilling,
    getBillingUsers,
    updateBillingDetails,
    deleteBillingDetails,
    getTracker,
    addTrackerPhase,
    updateTrackerPhase,
    deleteTrackerPhase,
    uploadInvoicePDF,
    replaceInvoice,
    getInvoices,
    deleteInvoice,
    updateProgress,
    viewInvoice,
    getBillingDetails,
    resetUserMpin
} = require('../controllers/usersController');

router.get('/', auth, getAllUsers);
router.get('/:id', auth, getUserById);
router.post('/', auth, createUser);
router.put('/:id', auth, updateUser);
router.delete('/:id', auth, deleteUser);
router.post('/:id/reset-mpin', auth, resetUserMpin);

// Billing routes
router.post('/:id/enable-billing', auth, enableBilling);
router.get('/billing/enabled', auth, getBillingUsers);
router.post('/:id/enable-billing', auth, enableBilling);
router.get('/billing/enabled', auth, getBillingUsers);
router.get('/:id/billing-details', auth, getBillingDetails);
router.put('/:id/billing-details', auth, updateBillingDetails);
router.delete('/:id/billing-details', auth, deleteBillingDetails);

// Project Tracker routes
router.get('/:id/tracker', auth, getTracker);
router.post('/:id/tracker', auth, addTrackerPhase);
router.put('/:id/tracker/:trackerId', auth, updateTrackerPhase);
router.delete('/:id/tracker/:trackerId', auth, deleteTrackerPhase);

// Invoice routes
router.post('/:id/invoices', auth, uploadInvoice.single('invoice'), uploadInvoicePDF);
router.get('/:id/invoices', auth, getInvoices);
router.put('/:id/invoices/:invoiceId', auth, uploadInvoice.single('invoice'), replaceInvoice);
router.put('/:id/invoices/:invoiceId', auth, uploadInvoice.single('invoice'), replaceInvoice);
router.get('/:id/invoices/:invoiceId/view', authQueryToken, viewInvoice);
router.delete('/:id/invoices/:invoiceId', auth, deleteInvoice);

// Progress routes (Legacy? Keeping for now if needed, but tracker replaces it mostly)
router.put('/:id/progress', auth, updateProgress);

module.exports = router;

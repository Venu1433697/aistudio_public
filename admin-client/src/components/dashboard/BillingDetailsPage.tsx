import React, { useState, useEffect } from 'react';
import { ArrowLeft, Loader2, Save, X, DollarSign, User, Mail, Calendar, Edit3, Upload, Download, Trash2, FileText, Plus, Check, RefreshCw, Key } from 'lucide-react';
import { api } from '../../services/api';
import toast from 'react-hot-toast';

interface BillingDetailsPageProps {
    userId: string;
    onBack?: () => void;
}

export const BillingDetailsPage: React.FC<BillingDetailsPageProps> = ({ userId, onBack }) => {
    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        totalCost: 0,
        paidAmount: 0
    });

    // Invoice state
    const [invoices, setInvoices] = useState<any[]>([]);
    const [isUploadingInvoice, setIsUploadingInvoice] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [replaceInvoiceId, setReplaceInvoiceId] = useState<string | null>(null);

    // Tracker state
    const [trackerPhases, setTrackerPhases] = useState<any[]>([]);
    const [isAddingPhase, setIsAddingPhase] = useState(false);
    const [newPhase, setNewPhase] = useState({ name: '', date: '', status: 'Soon' });
    const [editingPhaseId, setEditingPhaseId] = useState<string | null>(null);
    const [editPhaseData, setEditPhaseData] = useState({ name: '', date: '', status: 'Soon' });

    // Reset MPIN state
    const [isResettingMpin, setIsResettingMpin] = useState(false);
    const [newMpin, setNewMpin] = useState('');
    const [showMpinModal, setShowMpinModal] = useState(false);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const data = await api.getUserBillingDetails(userId);
                setUser(data);

                // Handle new billing structure
                const billing = data.billing || data.billingDetails || {};

                setFormData({
                    totalCost: billing.totalCost || 0,
                    paidAmount: billing.paidAmount || 0
                });

                // Fetch invoices
                const invoiceData = await api.getInvoices(userId);
                setInvoices(invoiceData);

                // Fetch tracker
                const trackerData = await api.getTracker(userId);
                setTrackerPhases(trackerData);

            } catch (error) {
                console.error('Error fetching user billing details:', error);
                toast.error('Failed to load user billing details');
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserDetails();
    }, [userId]);

    const handleSave = async () => {
        try {
            setIsSaving(true);
            const updated = await api.updateBillingDetails(userId, formData);
            setUser(updated);
            setIsEditing(false);
            toast.success('Billing details updated successfully');
        } catch (error) {
            console.error('Error updating billing details:', error);
            toast.error('Failed to update billing details');
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        const billing = user.billing || user.billingDetails || {};
        setFormData({
            totalCost: billing.totalCost || 0,
            paidAmount: billing.paidAmount || 0
        });
        setIsEditing(false);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.type !== 'application/pdf') {
                toast.error('Only PDF files are allowed');
                return;
            }
            if (file.size > 10 * 1024 * 1024) {
                toast.error('File size must be less than 10MB');
                return;
            }
            setSelectedFile(file);
        }
    };

    const handleUploadInvoice = async () => {
        if (!selectedFile) {
            toast.error('Please select a file first');
            return;
        }

        const adminProfile = localStorage.getItem('os_profile');
        let adminEmail = '';
        if (adminProfile) {
            try {
                const parsed = JSON.parse(adminProfile);
                adminEmail = parsed.email || '';
            } catch (e) {
                console.error('Error parsing admin profile', e);
            }
        }

        try {
            setIsUploadingInvoice(true);
            if (replaceInvoiceId) {
                await api.replaceInvoice(userId, replaceInvoiceId, selectedFile, adminEmail);
                toast.success('Invoice replaced successfully');
                setReplaceInvoiceId(null);
            } else {
                await api.uploadInvoice(userId, selectedFile, adminEmail);
                toast.success('Invoice uploaded successfully');
            }

            const updatedInvoices = await api.getInvoices(userId);
            setInvoices(updatedInvoices);
            setSelectedFile(null);
        } catch (error: any) {
            console.error('Error uploading invoice:', error);
            toast.error(error.message || 'Failed to upload invoice');
        } finally {
            setIsUploadingInvoice(false);
        }
    };

    const handleDeleteInvoice = async (invoiceId: string) => {
        const confirmed = window.confirm('Are you sure you want to delete this invoice?');
        if (!confirmed) return;

        try {
            await api.deleteInvoice(userId, invoiceId);
            setInvoices(prev => prev.filter(inv => inv._id !== invoiceId));
            toast.success('Invoice deleted successfully');
        } catch (error) {
            console.error('Error deleting invoice:', error);
            toast.error('Failed to delete invoice');
        }
    };

    // --- Tracker Functions ---

    const handleAddPhase = async () => {
        if (!newPhase.name) {
            toast.error('Phase name is required');
            return;
        }

        try {
            const updatedTracker = await api.addTrackerPhase(userId, newPhase);
            setTrackerPhases(updatedTracker);
            setNewPhase({ name: '', date: '', status: 'Soon' });
            setIsAddingPhase(false);
            toast.success('Phase added successfully');
        } catch (error) {
            console.error('Error adding phase:', error);
            toast.error('Failed to add phase');
        }
    };

    const handleUpdatePhase = async (trackerId: string) => {
        try {
            const updatedTracker = await api.updateTrackerPhase(userId, trackerId, editPhaseData);
            setTrackerPhases(updatedTracker);
            setEditingPhaseId(null);
            toast.success('Phase updated successfully');
        } catch (error) {
            console.error('Error updating phase:', error);
            toast.error('Failed to update phase');
        }
    };

    const handleDeletePhase = async (trackerId: string) => {
        if (!window.confirm('Delete this phase?')) return;
        try {
            const updatedTracker = await api.deleteTrackerPhase(userId, trackerId);
            setTrackerPhases(updatedTracker);
            toast.success('Phase deleted successfully');
        } catch (error) {
            console.error('Error deleting phase:', error);
            toast.error('Failed to delete phase');
        }
    };

    const handleResetMpin = async () => {
        if (!newMpin || newMpin.length !== 4) {
            toast.error('MPIN must be 4 digits');
            return;
        }
        try {
            setIsResettingMpin(true);
            await api.resetUserMpin(userId, newMpin);
            toast.success('MPIN reset successfully');
            setShowMpinModal(false);
            setNewMpin('');
        } catch (error: any) {
            console.error('Error resetting MPIN:', error);
            toast.error(error.message || 'Failed to reset MPIN');
        } finally {
            setIsResettingMpin(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    const calculateRemaining = () => {
        return formData.totalCost - formData.paidAmount;
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-96 text-gray-500">
                <Loader2 className="w-8 h-8 animate-spin mb-2 text-black" />
                <p>Loading Billing Details...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center h-96 text-gray-500">
                <p>User not found</p>
                {onBack && (
                    <button
                        onClick={onBack}
                        className="mt-4 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        Go Back
                    </button>
                )}
            </div>
        );
    }

    const billing = user.billing || user.billingDetails || {};

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div>
                <div className="flex items-center gap-4 mb-2">
                    {onBack && (
                        <button
                            onClick={onBack}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Go back to Billing"
                        >
                            <ArrowLeft size={20} />
                        </button>
                    )}
                    <h2 className="text-2xl font-bold text-gray-900">Billing Details</h2>
                </div>
                <p className="text-sm text-gray-500 ml-12">
                    Manage project cost and payment information for {user.firstName} {user.lastName}
                </p>
            </div>

            {/* User Information Card */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <User size={20} />
                    User Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</label>
                        <p className="text-sm text-gray-900 font-medium mt-1">{user.firstName} {user.lastName}</p>
                    </div>
                    <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Email</label>
                        <p className="text-sm text-gray-900 mt-1 flex items-center gap-2">
                            <Mail size={14} className="text-gray-400" />
                            {user.email}
                        </p>
                    </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
                    <button
                        onClick={() => setShowMpinModal(true)}
                        className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-2"
                    >
                        <Key size={16} />
                        Reset MPIN
                    </button>
                </div>
            </div>

            {/* Reset MPIN Modal */}
            {showMpinModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Reset User MPIN</h3>
                        <p className="text-sm text-gray-500 mb-4">
                            Enter a new 4-digit MPIN for {user.firstName}. This will immediately override their existing MPIN.
                        </p>
                        <input
                            type="text"
                            maxLength={4}
                            placeholder="Enter new 4-digit MPIN"
                            value={newMpin}
                            onChange={(e) => setNewMpin(e.target.value.replace(/\D/g, ''))}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-center text-2xl tracking-widest font-bold mb-6 focus:outline-none focus:border-black"
                        />
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowMpinModal(false)}
                                className="flex-1 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleResetMpin}
                                disabled={isResettingMpin || newMpin.length !== 4}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50"
                            >
                                {isResettingMpin ? 'Resetting...' : 'Reset MPIN'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Billing Details Card */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <DollarSign size={20} />
                        Financial Details
                    </h3>
                    {!isEditing && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                        >
                            <Edit3 size={16} />
                            Edit Details
                        </button>
                    )}
                </div>

                {isEditing ? (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Total Project Cost (₹)
                                </label>
                                <input
                                    type="number"
                                    value={formData.totalCost}
                                    onChange={(e) => setFormData({ ...formData, totalCost: Number(e.target.value) })}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                                    placeholder="Enter total cost"
                                    min="0"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Amount Paid (₹)
                                </label>
                                <input
                                    type="number"
                                    value={formData.paidAmount}
                                    onChange={(e) => setFormData({ ...formData, paidAmount: Number(e.target.value) })}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                                    placeholder="Enter paid amount"
                                    min="0"
                                    max={formData.totalCost}
                                />
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-gray-700">Remaining Amount:</span>
                                <span className={`text-xl font-bold ${calculateRemaining() > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                    {formatCurrency(calculateRemaining())}
                                </span>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                            <button
                                onClick={handleCancel}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors flex items-center gap-2"
                                disabled={isSaving}
                            >
                                <X size={16} />
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSaving ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save size={16} />
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                                <label className="text-xs font-medium text-blue-700 uppercase tracking-wider">Total Cost</label>
                                <p className="text-2xl font-bold text-blue-900 mt-2">
                                    {formatCurrency(billing.totalCost || 0)}
                                </p>
                            </div>
                            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                                <label className="text-xs font-medium text-green-700 uppercase tracking-wider">Paid Amount</label>
                                <p className="text-2xl font-bold text-green-900 mt-2">
                                    {formatCurrency(billing.paidAmount || 0)}
                                </p>
                            </div>
                            <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                                <label className="text-xs font-medium text-red-700 uppercase tracking-wider">Remaining</label>
                                <p className="text-2xl font-bold text-red-900 mt-2">
                                    {formatCurrency((billing.totalCost || 0) - (billing.paidAmount || 0))}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Invoice Management Card */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FileText size={20} />
                    Invoices
                </h3>

                {/* Upload Section */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-4">
                        <input
                            type="file"
                            accept="application/pdf"
                            onChange={handleFileSelect}
                            className="hidden"
                            id="invoice-upload"
                        />
                        <label
                            htmlFor="invoice-upload"
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                        >
                            <Upload size={16} />
                            {replaceInvoiceId ? 'Choose Replacement PDF' : 'Choose PDF'}
                        </label>
                        {selectedFile && (
                            <span className="text-sm text-gray-600 flex-1">{selectedFile.name}</span>
                        )}
                        <button
                            onClick={handleUploadInvoice}
                            disabled={!selectedFile || isUploadingInvoice}
                            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isUploadingInvoice ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    {replaceInvoiceId ? 'Replacing...' : 'Uploading...'}
                                </>
                            ) : (
                                <>
                                    <Upload size={16} />
                                    {replaceInvoiceId ? 'Replace Invoice' : 'Upload'}
                                </>
                            )}
                        </button>
                        {replaceInvoiceId && (
                            <button
                                onClick={() => { setReplaceInvoiceId(null); setSelectedFile(null); }}
                                className="p-2 text-gray-500 hover:text-black"
                                title="Cancel Replacement"
                            >
                                <X size={20} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Invoice List */}
                {invoices.length > 0 ? (
                    <div className="space-y-2">
                        {invoices.map((invoice) => (
                            <div key={invoice._id} className={`flex items-center justify-between p-3 bg-gray-50 rounded-lg border ${replaceInvoiceId === invoice._id ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-200'} hover:bg-gray-100 transition-colors`}>
                                <div className="flex items-center gap-3 flex-1">
                                    <FileText size={18} className="text-red-600" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{invoice.filename}</p>
                                        <p className="text-xs text-gray-500">
                                            Uploaded on {new Date(invoice.uploadDate).toLocaleDateString('en-IN')} by {invoice.uploadedBy}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setReplaceInvoiceId(invoice._id)}
                                        className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                                        title="Replace Invoice"
                                    >
                                        <RefreshCw size={18} />
                                    </button>
                                    <a
                                        href={api.viewInvoice(userId, invoice._id)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 text-gray-600 hover:text-black transition-colors"
                                        title="Download Invoice"
                                    >
                                        <Download size={18} />
                                    </a>
                                    <button
                                        onClick={() => handleDeleteInvoice(invoice._id)}
                                        className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                                        title="Delete Invoice"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-400">
                        <FileText size={48} className="mx-auto mb-2 opacity-50" />
                        <p>No invoices uploaded yet</p>
                    </div>
                )}
            </div>

            {/* Project Tracker Card */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <Check size={20} />
                        Project Tracker
                    </h3>
                    {!isAddingPhase && (
                        <button
                            onClick={() => setIsAddingPhase(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                        >
                            <Plus size={16} />
                            Add Phase
                        </button>
                    )}
                </div>

                {isAddingPhase && (
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200 animate-fade-in-up">
                        <h4 className="text-sm font-bold text-gray-900 mb-3">New Project Phase</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <input
                                type="text"
                                placeholder="Phase Name (e.g. Foundation)"
                                value={newPhase.name}
                                onChange={(e) => setNewPhase({ ...newPhase, name: e.target.value })}
                                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-black"
                            />
                            <input
                                type="text"
                                placeholder="Date (e.g. 12 Oct 2023)"
                                value={newPhase.date}
                                onChange={(e) => setNewPhase({ ...newPhase, date: e.target.value })}
                                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-black"
                            />
                            <select
                                value={newPhase.status}
                                onChange={(e) => setNewPhase({ ...newPhase, status: e.target.value })}
                                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-black"
                            >
                                <option value="Soon">Soon</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Done">Done</option>
                            </select>
                        </div>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setIsAddingPhase(false)}
                                className="px-3 py-1 text-gray-600 hover:bg-gray-200 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddPhase}
                                className="px-3 py-1 bg-black text-white rounded-lg hover:bg-gray-800"
                            >
                                Add Phase
                            </button>
                        </div>
                    </div>
                )}

                <div className="space-y-3">
                    {trackerPhases.map((phase) => (
                        <div key={phase._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                            {editingPhaseId === phase._id ? (
                                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 mr-4">
                                    <input
                                        type="text"
                                        value={editPhaseData.name}
                                        onChange={(e) => setEditPhaseData({ ...editPhaseData, name: e.target.value })}
                                        className="border border-gray-300 rounded-lg px-2 py-1"
                                    />
                                    <input
                                        type="text"
                                        value={editPhaseData.date}
                                        onChange={(e) => setEditPhaseData({ ...editPhaseData, date: e.target.value })}
                                        className="border border-gray-300 rounded-lg px-2 py-1"
                                    />
                                    <select
                                        value={editPhaseData.status}
                                        onChange={(e) => setEditPhaseData({ ...editPhaseData, status: e.target.value })}
                                        className="border border-gray-300 rounded-lg px-2 py-1"
                                    >
                                        <option value="Soon">Soon</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Done">Done</option>
                                    </select>
                                </div>
                            ) : (
                                <div className="flex-1">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-3 h-3 rounded-full ${phase.status === 'Done' ? 'bg-green-500' :
                                            phase.status === 'In Progress' ? 'bg-blue-500' : 'bg-gray-300'
                                            }`} />
                                        <h4 className="font-medium text-gray-900">{phase.name}</h4>
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${phase.status === 'Done' ? 'bg-green-100 text-green-700' :
                                            phase.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-600'
                                            }`}>
                                            {phase.status}
                                        </span>
                                    </div>
                                    {phase.date && <p className="text-xs text-gray-500 mt-1 ml-6">{phase.date}</p>}
                                </div>
                            )}

                            <div className="flex items-center gap-2">
                                {editingPhaseId === phase._id ? (
                                    <>
                                        <button
                                            onClick={() => handleUpdatePhase(phase._id)}
                                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                                        >
                                            <Save size={16} />
                                        </button>
                                        <button
                                            onClick={() => setEditingPhaseId(null)}
                                            className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                                        >
                                            <X size={16} />
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => {
                                                setEditingPhaseId(phase._id);
                                                setEditPhaseData({ name: phase.name, date: phase.date, status: phase.status });
                                            }}
                                            className="p-2 text-gray-500 hover:text-black transition-colors"
                                        >
                                            <Edit3 size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDeletePhase(phase._id)}
                                            className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                    {trackerPhases.length === 0 && (
                        <div className="text-center py-8 text-gray-400">
                            <p>No project phases added yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

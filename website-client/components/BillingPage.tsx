import React, { useState, useEffect } from 'react';
import { getBillingSummary, getProjectTracker, getInvoices, getPayments, downloadInvoice } from '../services/api';

// --- Helper Modal Component for Email Choice (Reused logic) ---
interface EmailChoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  gmailLink: string;
  defaultLink: string;
}

const EmailChoiceModal: React.FC<EmailChoiceModalProps> = ({ isOpen, onClose, gmailLink, defaultLink }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all scale-100">
        <div className="bg-brand-dark p-4 text-white flex justify-between items-center">
          <h3 className="font-bold text-lg">Choose Email App</h3>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="p-6 space-y-4">
          <a href={gmailLink} target="_blank" rel="noopener noreferrer" onClick={onClose} className="flex items-center gap-3 w-full p-3 rounded-xl border border-gray-200 hover:bg-red-50 hover:border-red-200 transition-all group">
            <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-colors">
              <span className="font-bold text-lg">G</span>
            </div>
            <span className="font-bold text-gray-800">Gmail</span>
          </a>
          <a href={defaultLink} onClick={onClose} className="flex items-center gap-3 w-full p-3 rounded-xl border border-gray-200 hover:bg-blue-50 hover:border-blue-200 transition-all group">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            </div>
            <span className="font-bold text-gray-800">Outlook / Default</span>
          </a>
        </div>
      </div>
    </div>
  );
};

// --- Main Send Proof Modal ---
interface SendProofModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectEmail: () => void;
  onShareNative: () => void;
  canShareNative: boolean;
}

const SendProofModal: React.FC<SendProofModalProps> = ({ isOpen, onClose, onSelectEmail, onShareNative, canShareNative }) => {
  if (!isOpen) return null;

  const whatsappNumber = '919398355147';
  const message = encodeURIComponent('Hello NK Solutions, I am sharing the payment receipt for my project. (Attached below)');
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${message}`;

  const handleWhatsAppClick = () => {
    alert("Opening WhatsApp... Note: Browser security prevents auto-attaching files here. Please select the image again in WhatsApp.");
    window.open(whatsappLink, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all scale-100">
        <div className="bg-brand-dark p-4 text-white flex justify-between items-center">
          <h3 className="font-bold text-lg">Send Receipt</h3>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="p-6 space-y-4">

          {/* Native Share Option */}
          {canShareNative && (
            <button
              onClick={onShareNative}
              className="flex items-center gap-3 w-full p-3 rounded-xl border-2 border-brand-pink/20 bg-brand-pink/5 hover:bg-brand-pink/10 transition-all group text-left mb-4"
            >
              <div className="w-10 h-10 bg-brand-pink text-white rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
              </div>
              <div>
                <span className="font-bold text-brand-dark block">Share Directly</span>
                <span className="text-xs text-gray-500">Best for Mobile (WhatsApp, Mail, etc.)</span>
              </div>
            </button>
          )}

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink-0 mx-4 text-gray-400 text-xs uppercase font-bold">Or Select Manually</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          <button
            onClick={handleWhatsAppClick}
            className="flex items-center gap-3 w-full p-3 rounded-xl border border-gray-200 hover:bg-green-50 hover:border-green-200 transition-all group text-left"
          >
            <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center group-hover:bg-green-600 group-hover:text-white transition-colors">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
            </div>
            <div>
              <span className="font-bold text-gray-800 block">Email</span>
              <span className="text-xs text-gray-500">Select App (Gmail/Outlook)</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

interface BillingPageProps {
  onNavigate: (view: string) => void;
}

const BillingPage: React.FC<BillingPageProps> = ({ onNavigate }) => {
  const [showSendModal, setShowSendModal] = useState(false);
  const [showEmailChoice, setShowEmailChoice] = useState(false);
  const [receiptImage, setReceiptImage] = useState<string | null>(null);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);

  const [billingSummary, setBillingSummary] = useState<any>(null);
  const [tracker, setTracker] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [summaryRes, trackerRes, invoicesRes, paymentsRes] = await Promise.all([
          getBillingSummary(),
          getProjectTracker(),
          getInvoices(),
          getPayments()
        ]);

        setBillingSummary(summaryRes.data);
        setTracker(trackerRes.data);
        setInvoices(invoicesRes.data);
        setPayments(paymentsRes.data);
      } catch (error) {
        console.error("Failed to fetch billing data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  const recipient = "avenu3697@gmail.com";
  const subject = "Payment Receipt Proof";
  const body = "Please find the attached payment receipt image for my project.";

  const defaultMailto = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${recipient}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceiptFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const canShareNative = typeof navigator !== 'undefined' && !!navigator.share && !!receiptFile;

  const handleNativeShare = async () => {
    if (!receiptFile) return;
    try {
      await navigator.share({
        files: [receiptFile],
        title: 'Payment Receipt',
        text: 'Here is the payment receipt for NK Fearless Solutions.'
      });
      setShowSendModal(false);
    } catch (error) {
      console.log('Sharing failed or cancelled', error);
    }
  };

  const handleViewInvoice = (invoiceId: string) => {
    window.open(downloadInvoice(invoiceId), '_blank');
  };

  const handleDownloadInvoice = (invoiceId: string, filename: string) => {
    const link = document.createElement('a');
    link.href = downloadInvoice(invoiceId);
    link.download = filename || 'Invoice.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShareInvoice = async (inv: any) => {
    const shareData = {
      title: `Invoice #${inv.number}`,
      text: `Here is the invoice #${inv.number} from NK Fearless Solutions.`,
      text: `Here is the invoice #${inv.number} from NK Fearless Solutions.`,
      url: downloadInvoice(inv._id)
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Error sharing invoice:', err);
      }
    } else {
      alert("Share feature is not supported on this device/browser. You can copy the URL manually.");
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  if (!billingSummary || !billingSummary.billingEnabled) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Active Project</h2>
          <p className="text-gray-500 mb-6">Billing details are not enabled for your account yet. Please contact the administrator if you have an active project.</p>
          <button onClick={() => onNavigate('home')} className="bg-black text-white px-6 py-2 rounded-lg font-bold hover:bg-gray-800 transition-colors">
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 animate-fade-in font-sans pb-20">

      <SendProofModal
        isOpen={showSendModal}
        onClose={() => setShowSendModal(false)}
        onSelectEmail={() => { setShowSendModal(false); setShowEmailChoice(true); }}
        onShareNative={handleNativeShare}
        canShareNative={canShareNative}
      />

      <EmailChoiceModal
        isOpen={showEmailChoice}
        onClose={() => setShowEmailChoice(false)}
        gmailLink={gmailUrl}
        defaultLink={defaultMailto}
      />

      <div className="bg-white border-b border-gray-200 py-6 px-6 shadow-sm">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <button onClick={() => onNavigate('profile')} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7 7-7" /></svg>
          </button>
          <h1 className="font-serif text-2xl font-bold text-gray-900">Billing & Payments</h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 mt-8 space-y-8">

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Total Project Cost</p>
            <p className="text-3xl font-bold text-gray-900">₹ {billingSummary.totalCost}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-xs font-bold text-green-600 uppercase tracking-wider mb-2">Paid Amount</p>
            <p className="text-3xl font-bold text-green-600">₹ {billingSummary.paidAmount}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-xs font-bold text-red-500 uppercase tracking-wider mb-2">Pending Due</p>
            <p className="text-3xl font-bold text-red-500">₹ {billingSummary.pendingAmount}</p>
          </div>
        </div>

        {/* --- Project Timeline Section --- */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <h3 className="font-bold text-gray-900">Project Timeline</h3>
          </div>
          <div className="p-6 md:p-8">
            <div className="relative border-l-2 border-gray-200 ml-3 space-y-8 pb-2">
              {tracker.length > 0 ? tracker.map((event, idx) => (
                <div key={idx} className="relative pl-8">
                  {/* Timeline Dot */}
                  <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white shadow-sm ${event.status === 'Done' ? 'bg-green-500' :
                    event.status === 'In Progress' ? 'bg-blue-500 ring-4 ring-blue-100' : 'bg-gray-300'
                    }`}></div>

                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                    <div>
                      <h4 className={`font-bold text-lg ${event.status === 'Soon' ? 'text-gray-400' : 'text-gray-900'}`}>
                        {event.name}
                      </h4>
                      <div className="flex gap-6 mt-1 text-sm">
                        <div>
                          <span className="text-gray-400 text-xs uppercase tracking-wider block">Date</span>
                          <span className="font-medium text-gray-600">{event.date || '-'}</span>
                        </div>
                      </div>
                    </div>
                    {event.status === 'Done' && (
                      <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded self-start mt-2 sm:mt-0">Done</span>
                    )}
                    {event.status === 'In Progress' && (
                      <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded self-start mt-2 sm:mt-0 animate-pulse">Ongoing</span>
                    )}
                    {event.status === 'Soon' && (
                      <span className="bg-gray-100 text-gray-500 text-xs font-bold px-2 py-1 rounded self-start mt-2 sm:mt-0">Soon</span>
                    )}
                  </div>
                </div>
              )) : (
                <p className="text-gray-500 italic">No timeline events added yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Payment History */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <h3 className="font-bold text-gray-900">Payment History</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Description</th>
                  <th className="px-6 py-3">Mode</th>
                  <th className="px-6 py-3 text-right">Amount</th>
                  <th className="px-6 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {payments.length > 0 ? payments.map((payment: any, index: number) => (
                  <tr key={index} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4">{payment.date}</td>
                    <td className="px-6 py-4">{payment.description}</td>
                    <td className="px-6 py-4">{payment.mode}</td>
                    <td className="px-6 py-4 text-right font-bold">₹ {payment.amount}</td>
                    <td className="px-6 py-4 text-center"><span className="bg-green-100 text-green-600 px-2 py-1 rounded text-xs font-bold">{payment.status}</span></td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-400">No payments recorded yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Upload Receipt Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <h3 className="font-bold text-gray-900">Submit Payment Proof</h3>
          </div>
          <div className="p-6">
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-brand-pink transition-colors bg-gray-50/30">
              {receiptImage ? (
                <div className="relative max-w-xs mx-auto">
                  <img src={receiptImage} alt="Receipt" className="rounded-lg shadow-md w-full" />
                  <button
                    onClick={() => { setReceiptImage(null); setReceiptFile(null); }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              ) : (
                <>
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  <p className="text-gray-500 mb-4">Upload screenshot of Google Pay / PhonePe / Bank Receipt</p>
                  <label className="cursor-pointer bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-bold hover:bg-gray-50 transition-colors shadow-sm inline-block">
                    Select Image
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                  </label>
                </>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowSendModal(true)}
                disabled={!receiptImage}
                className="bg-brand-dark text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                Send Proof
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
              </button>
            </div>
          </div>
        </div>

        {/* Invoices Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <h3 className="font-bold text-gray-900">Invoices</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {invoices.length > 0 ? invoices.map((inv: any, index: number) => (
              <div key={index} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-red-100 text-red-500 rounded-lg flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Invoice #{inv.number || 'N/A'}</p>
                    <p className="text-xs text-gray-500">Issued on {new Date(inv.uploadDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => handleShareInvoice(inv)} className="text-sm text-gray-500 hover:text-brand-dark font-medium flex items-center gap-1 p-2 rounded hover:bg-gray-100 transition-colors" title="Share">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                  </button>
                  <button onClick={() => handleViewInvoice(inv._id)} className="text-sm text-gray-500 hover:text-brand-dark font-medium underline">View</button>
                  <button onClick={() => handleDownloadInvoice(inv._id, inv.filename)} className="text-sm text-brand-pink font-bold hover:underline flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    Download
                  </button>
                </div>
              </div>
            )) : (
              <div className="p-6 text-center text-gray-400">No invoices available.</div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default BillingPage;
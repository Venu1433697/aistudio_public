import React, { useState } from 'react';

// --- Helper Modal Component for Email Choice ---
interface EmailChoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  gmailLink: string;
  defaultLink: string;
}

const EmailChoiceModal: React.FC<EmailChoiceModalProps> = ({ isOpen, onClose, gmailLink, defaultLink }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all scale-100">
        <div className="bg-brand-dark p-4 text-white flex justify-between items-center">
          <h3 className="font-bold text-lg">Choose Email App</h3>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-gray-600 text-sm mb-2">How would you like to send your message?</p>
          
          <a 
            href={gmailLink} 
            target="_blank" 
            rel="noopener noreferrer"
            onClick={onClose}
            className="flex items-center gap-3 w-full p-3 rounded-xl border border-gray-200 hover:bg-red-50 hover:border-red-200 transition-all group"
          >
            <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-colors">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/></svg>
            </div>
            <span className="font-bold text-gray-800">Gmail</span>
          </a>

          <a 
            href={defaultLink}
            onClick={onClose}
            className="flex items-center gap-3 w-full p-3 rounded-xl border border-gray-200 hover:bg-blue-50 hover:border-blue-200 transition-all group"
          >
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


export const CareersPage = () => (
  <div className="min-h-screen bg-gray-50 pt-28 pb-20 px-6 font-sans animate-fade-in">
    <div className="max-w-3xl mx-auto text-center mb-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-4 font-serif">Join Team Fearless</h1>
      <p className="text-gray-600">Build your career with Karnataka's leading engineering solutions provider.</p>
    </div>
    <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
            <div>
                <h3 className="font-bold text-xl text-gray-900">Site Engineer</h3>
                <p className="text-gray-500">Bengaluru &bull; Full-time &bull; 3-5 Yrs Exp</p>
            </div>
            <button className="bg-brand-dark text-white px-6 py-2 rounded-lg hover:bg-gray-800">Apply Now</button>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
            <div>
                <h3 className="font-bold text-xl text-gray-900">Safety Officer</h3>
                <p className="text-gray-500">Mysuru &bull; Contract &bull; 2+ Yrs Exp</p>
            </div>
            <button className="bg-brand-dark text-white px-6 py-2 rounded-lg hover:bg-gray-800">Apply Now</button>
        </div>
    </div>
  </div>
);

export const ContactPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [showEmailModal, setShowEmailModal] = useState(false);

  const recipient = "avenu3697@gmail.com";
  const subject = encodeURIComponent(`Contact Request from ${name}`);
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);

  const defaultMailto = `mailto:${recipient}?subject=${subject}&body=${body}`;
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${recipient}&su=${subject}&body=${body}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowEmailModal(true);
  };

  return (
    <div className="min-h-screen bg-white pt-28 pb-20 px-6 font-sans animate-fade-in">
      <EmailChoiceModal 
        isOpen={showEmailModal} 
        onClose={() => setShowEmailModal(false)} 
        gmailLink={gmailUrl}
        defaultLink={defaultMailto}
      />

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
          <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-6 font-serif">Get in Touch</h1>
              <p className="text-gray-600 mb-8 text-lg">Have a project in mind? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
              
              <div className="space-y-6">
                  <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-brand-pink/10 rounded-full flex items-center justify-center text-brand-pink shrink-0">📍</div>
                      <div>
                          <h4 className="font-bold text-gray-900">Office</h4>
                          <p className="text-gray-500">#123, Fearless Plaza, Indiranagar,<br/>Bengaluru, Karnataka 560038</p>
                      </div>
                  </div>
                  <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-brand-pink/10 rounded-full flex items-center justify-center text-brand-pink shrink-0">📞</div>
                      <div>
                          <h4 className="font-bold text-gray-900">Phone</h4>
                          <p className="text-gray-500">+91 98765 43210</p>
                      </div>
                  </div>
                  <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-brand-pink/10 rounded-full flex items-center justify-center text-brand-pink shrink-0">✉️</div>
                      <div>
                          <h4 className="font-bold text-gray-900">Email</h4>
                          <p className="text-gray-500">info@nkfearless.com</p>
                      </div>
                  </div>
              </div>
          </div>
          <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Send Message</h3>
              <form className="space-y-4" onSubmit={handleSubmit}>
                  <input type="text" placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-pink focus:border-transparent outline-none" />
                  <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-pink focus:border-transparent outline-none" />
                  <textarea placeholder="Message" rows={4} value={message} onChange={(e) => setMessage(e.target.value)} className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-pink focus:border-transparent outline-none"></textarea>
                  <button className="w-full bg-brand-pink text-white font-bold py-3 rounded-lg hover:bg-pink-600 transition-colors">Send Message</button>
              </form>
          </div>
      </div>
    </div>
  );
};

export const PrivacyPolicyPage = () => (
  <div className="min-h-screen bg-gray-50 pt-28 pb-20 px-6 font-sans animate-fade-in">
    <div className="max-w-3xl mx-auto bg-white p-10 rounded-xl shadow-sm border border-gray-100">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 font-serif">Privacy Policy</h1>
      <div className="space-y-4 text-gray-600 text-sm leading-relaxed">
        <p>At NK Fearless Solutions, we prioritize your privacy. This policy outlines how we collect, use, and protect your personal information.</p>
        <h4 className="font-bold text-gray-900 pt-4">1. Information Collection</h4>
        <p>We collect information necessary to provide our services, including name, contact details, and project requirements.</p>
        <h4 className="font-bold text-gray-900 pt-4">2. Use of Information</h4>
        <p>Your data is used solely for project coordination, communication, and improving our service offerings. We do not sell data to third parties.</p>
        <h4 className="font-bold text-gray-900 pt-4">3. Data Security</h4>
        <p>We implement industry-standard security measures to protect your data from unauthorized access.</p>
      </div>
    </div>
  </div>
);

export const RequestQuotePage = () => {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [service, setService] = useState('Waterproofing');
  const [details, setDetails] = useState('');
  const [showEmailModal, setShowEmailModal] = useState(false);

  const recipient = "avenu3697@gmail.com";
  const subject = encodeURIComponent(`Quote Request: ${service} - ${name}`);
  const body = encodeURIComponent(`Name: ${name}\nMobile: ${mobile}\nService: ${service}\n\nProject Details:\n${details}`);

  const defaultMailto = `mailto:${recipient}?subject=${subject}&body=${body}`;
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${recipient}&su=${subject}&body=${body}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowEmailModal(true);
  };

  return (
    <div className="min-h-screen bg-brand-dark pt-28 pb-20 px-6 font-sans animate-fade-in text-white">
      <EmailChoiceModal 
        isOpen={showEmailModal} 
        onClose={() => setShowEmailModal(false)} 
        gmailLink={gmailUrl}
        defaultLink={defaultMailto}
      />

      <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 font-serif">Request a Quote</h1>
          <p className="text-gray-300 mb-12 text-lg">Tell us about your project needs, and we'll provide a detailed estimate within 24 hours.</p>
          
          <div className="bg-white text-left p-8 rounded-2xl shadow-2xl">
              <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Name</label>
                          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:border-brand-pink" />
                      </div>
                      <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Mobile</label>
                          <input type="tel" value={mobile} onChange={(e) => setMobile(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:border-brand-pink" />
                      </div>
                  </div>
                  <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Service Required</label>
                      <select value={service} onChange={(e) => setService(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:border-brand-pink">
                          <option>Waterproofing</option>
                          <option>Construction</option>
                          <option>Piping</option>
                          <option>Instrument Repair</option>
                          <option>Other</option>
                      </select>
                  </div>
                  <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Project Details</label>
                      <textarea rows={4} value={details} onChange={(e) => setDetails(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:border-brand-pink"></textarea>
                  </div>
                  <button className="w-full bg-brand-pink text-white font-bold py-4 rounded-xl hover:bg-pink-600 transition-colors text-lg shadow-lg">
                      Submit Request
                  </button>
              </form>
          </div>
      </div>
    </div>
  );
};
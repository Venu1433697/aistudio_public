import React from 'react';

interface FooterProps {
  onNavigate: (view: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  
  const handleNavClick = (view: string) => {
    window.scrollTo(0, 0);
    onNavigate(view);
  };

  return (
    <footer className="bg-white border-t border-gray-100 py-16 px-6 md:px-12 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="md:col-span-1">
            <span 
              onClick={() => handleNavClick('home')} 
              className="font-serif text-2xl font-bold text-brand-dark cursor-pointer hover:text-gray-700"
            >
              NK Fearless
            </span>
            <p className="mt-4 text-sm text-gray-500 leading-relaxed">
                NK Fearless Solutions Pvt Ltd provides expert construction, waterproofing, and civil engineering instrument services across Karnataka.
            </p>
            <div className="flex gap-4 mt-6">
                {/* Social Links */}
                <a href="https://www.linkedin.com" target="_blank" rel="noreferrer" className="w-8 h-8 bg-gray-100 rounded-full hover:bg-brand-pink hover:text-white flex items-center justify-center cursor-pointer transition-colors text-gray-500">
                    <span className="text-xs font-bold">in</span>
                </a>
                <a href="https://www.facebook.com" target="_blank" rel="noreferrer" className="w-8 h-8 bg-gray-100 rounded-full hover:bg-brand-pink hover:text-white flex items-center justify-center cursor-pointer transition-colors text-gray-500">
                    <span className="text-xs font-bold">fb</span>
                </a>
                <a href="https://twitter.com" target="_blank" rel="noreferrer" className="w-8 h-8 bg-gray-100 rounded-full hover:bg-brand-pink hover:text-white flex items-center justify-center cursor-pointer transition-colors text-gray-500">
                    <span className="text-xs font-bold">tw</span>
                </a>
            </div>
        </div>

        <div>
            <h4 className="font-bold text-sm mb-4 text-gray-900">Services</h4>
            <ul className="space-y-3 text-sm text-gray-500">
                <li><button onClick={() => handleNavClick('waterproofing')} className="hover:text-black transition-colors text-left">Waterproofing</button></li>
                <li><button onClick={() => handleNavClick('polyurethane')} className="hover:text-black transition-colors text-left">Polyurethane Sealing</button></li>
                <li><button onClick={() => handleNavClick('piping')} className="hover:text-black transition-colors text-left">Industrial Piping</button></li>
                <li><button onClick={() => handleNavClick('construction')} className="hover:text-black transition-colors text-left">Construction</button></li>
                <li><button onClick={() => handleNavClick('instrument-repair')} className="hover:text-black transition-colors text-left">Instrument Repair</button></li>
            </ul>
        </div>
        <div>
            <h4 className="font-bold text-sm mb-4 text-gray-900">Company</h4>
            <ul className="space-y-3 text-sm text-gray-500">
                <li><button onClick={() => handleNavClick('about')} className="hover:text-black transition-colors text-left">About Us</button></li>
                <li><button onClick={() => handleNavClick('careers')} className="hover:text-black transition-colors text-left">Careers</button></li>
                <li><button onClick={() => handleNavClick('projects')} className="hover:text-black transition-colors text-left">Projects</button></li>
                <li><button onClick={() => handleNavClick('contact')} className="hover:text-black transition-colors text-left">Contact</button></li>
                <li><button onClick={() => handleNavClick('privacy')} className="hover:text-black transition-colors text-left">Privacy Policy</button></li>
            </ul>
        </div>
        <div>
            <h4 className="font-bold text-sm mb-4 text-gray-900">Contact Us</h4>
            <ul className="space-y-3 text-sm text-gray-500">
                <li>Bengaluru, Karnataka</li>
                <li><a href="mailto:info@nkfearless.com" className="hover:text-black">info@nkfearless.com</a></li>
                <li><a href="tel:+919876543210" className="hover:text-black">+91 98765 43210</a></li>
                <li className="pt-2">
                    <button onClick={() => handleNavClick('request-quote')} className="bg-brand-pink text-white px-4 py-2 rounded-md text-xs font-bold hover:bg-pink-600 transition-colors inline-block">Request Quote</button>
                </li>
            </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto border-t border-gray-100 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>© 2024 NK Fearless Solutions Pvt Ltd. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0 items-center">
             <span>Building Quality, Delivering Trust</span>
             <span className="text-brand-pink">🏗️</span>
          </div>
      </div>
    </footer>
  );
};

export default Footer;
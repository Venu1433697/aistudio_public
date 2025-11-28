import React from 'react';

const AboutUs: React.FC = () => {
  const whatsappNumber = '919398355147';
  const defaultMessage = encodeURIComponent('Hello, I want to know the list of services that NK Solutions will provide');
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${defaultMessage}`;

  return (
    <div className="bg-white font-sans animate-fade-in">
      {/* Hero Section */}
      <div className="relative bg-brand-dark text-white py-24 px-6 md:px-12 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
           <img src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2000&auto=format&fit=crop" alt="Background" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-brand-dark/90"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h1 className="font-serif text-4xl md:text-6xl font-bold mb-6">Fearless Engineering. Trusted Solutions.</h1>
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
            NK Fearless Solutions Pvt Ltd is a premier provider of construction, waterproofing, and civil engineering instrument services across Karnataka. We don't just fix problems; we engineer peace of mind.
          </p>
        </div>
      </div>

      {/* Mission & Values */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
           <div>
              <h2 className="font-serif text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-gray-600 mb-6 leading-relaxed text-lg">
                To provide robust, high-quality construction and maintenance services that stand the test of time. We specialize in identifying complex structural issues—from terrace leakages to industrial piping faults—and delivering lasting solutions using international-grade materials like polyurethane.
              </p>
              <p className="text-gray-600 leading-relaxed text-lg">
                Beyond construction, our precision instrument calibration wing ensures that civil engineers across the region work with absolute accuracy.
              </p>
           </div>
           <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-6 rounded-xl text-center border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                 <div className="text-4xl font-bold text-brand-pink mb-2">500+</div>
                 <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">Projects Completed</div>
              </div>
              <div className="bg-gray-50 p-6 rounded-xl text-center border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                 <div className="text-4xl font-bold text-brand-pink mb-2">100%</div>
                 <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">Client Satisfaction</div>
              </div>
              <div className="bg-gray-50 p-6 rounded-xl text-center border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                 <div className="text-4xl font-bold text-brand-pink mb-2">24/7</div>
                 <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">Support Available</div>
              </div>
              <div className="bg-gray-50 p-6 rounded-xl text-center border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                 <div className="text-4xl font-bold text-brand-pink mb-2">ISO</div>
                 <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">Certified Process</div>
              </div>
           </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="bg-brand-dark text-white py-20 px-6 md:px-12">
         <div className="max-w-6xl mx-auto text-center mb-12">
            <h2 className="font-serif text-3xl font-bold mb-4">Why Choose NK Fearless?</h2>
            <p className="text-gray-400">We bring a unique combination of heavy engineering and precision calibration.</p>
         </div>
         <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/5 p-8 rounded-xl border border-white/10">
                <h3 className="text-xl font-bold mb-3 text-brand-pink">Scientific Approach</h3>
                <p className="text-gray-400 text-sm leading-relaxed">We don't guess. We use advanced diagnostics to find the root cause of leakages and structural weaknesses before suggesting a fix.</p>
            </div>
            <div className="bg-white/5 p-8 rounded-xl border border-white/10">
                <h3 className="text-xl font-bold mb-3 text-brand-pink">International Materials</h3>
                <p className="text-gray-400 text-sm leading-relaxed">Our waterproofing utilizes high-grade Polyurethane and epoxy sealants that outlast traditional cement-based solutions.</p>
            </div>
            <div className="bg-white/5 p-8 rounded-xl border border-white/10">
                <h3 className="text-xl font-bold mb-3 text-brand-pink">End-to-End Service</h3>
                <p className="text-gray-400 text-sm leading-relaxed">From the foundation stone to the final electrical switch, and even the calibration of your surveying tools—we handle it all.</p>
            </div>
         </div>
      </div>

      {/* Services Overview */}
      <div className="bg-gray-50 py-20 px-6 md:px-12">
         <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
               <h2 className="font-serif text-3xl font-bold text-gray-900 mb-4">What We Do</h2>
               <p className="text-gray-500 text-lg">Comprehensive solutions for every building need.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all hover:-translate-y-1">
                  <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-6">
                     <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Waterproofing</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">Advanced solutions for terraces, basements, and tanks using polyurethane and structural sealing techniques.</p>
               </div>
               <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all hover:-translate-y-1">
                  <div className="w-14 h-14 bg-orange-50 rounded-full flex items-center justify-center text-orange-600 mb-6">
                     <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Construction</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">From general contracting for villas to industrial piping and electrical installations.</p>
               </div>
               <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all hover:-translate-y-1">
                  <div className="w-14 h-14 bg-pink-50 rounded-full flex items-center justify-center text-brand-pink mb-6">
                     <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Instruments</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">Maintenance, repair, and calibration of Total Stations, Theodolites, and Auto Levels.</p>
               </div>
            </div>
         </div>
      </div>

      {/* Testimonials */}
      <div className="py-20 px-6 md:px-12 border-t border-gray-100">
          <div className="max-w-6xl mx-auto text-center">
             <h2 className="font-serif text-3xl font-bold text-gray-900 mb-12">Trusted by Engineers & Homeowners</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                <div className="bg-gray-50 p-8 rounded-2xl relative">
                    <span className="text-6xl text-gray-200 absolute top-4 left-4 font-serif">"</span>
                    <p className="text-gray-600 relative z-10 mb-4 italic">"NK Fearless solved a basement leakage issue that three other contractors couldn't fix. Their PU injection method is like magic. Highly recommended."</p>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                        <div>
                            <p className="text-sm font-bold text-gray-900">Rajesh Kumar</p>
                            <p className="text-xs text-gray-500">Villa Owner, Whitefield</p>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-50 p-8 rounded-2xl relative">
                    <span className="text-6xl text-gray-200 absolute top-4 left-4 font-serif">"</span>
                    <p className="text-gray-600 relative z-10 mb-4 italic">"Their calibration service for our Total Stations is top-notch. Quick turnaround and NABL traceable certification. A reliable partner for our survey firm."</p>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                        <div>
                            <p className="text-sm font-bold text-gray-900">Civil Tech Surveys</p>
                            <p className="text-xs text-gray-500">Chief Surveyor</p>
                        </div>
                    </div>
                </div>
             </div>
          </div>
      </div>

      {/* WhatsApp CTA Section */}
      <div className="py-24 px-6 md:px-12 text-center bg-white">
         <h2 className="font-serif text-4xl font-bold text-gray-900 mb-6">Ready to start your project?</h2>
         <p className="text-gray-500 text-lg max-w-2xl mx-auto mb-10">
            Get a quick quote or consult with our engineers directly on WhatsApp.
         </p>
         
         <a 
           href={whatsappUrl} 
           target="_blank" 
           rel="noopener noreferrer"
           className="inline-flex items-center gap-3 bg-[#25D366] text-white font-bold py-4 px-10 rounded-full hover:bg-[#20bd5a] transition-all shadow-xl hover:shadow-2xl transform hover:scale-105 text-lg group"
         >
            <svg className="w-8 h-8 fill-current group-hover:rotate-12 transition-transform" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
            Chat on WhatsApp
         </a>
      </div>
    </div>
  );
};

export default AboutUs;
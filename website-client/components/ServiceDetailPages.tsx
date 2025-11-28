import React from 'react';

// Reusable Layout for Service Pages
const ServicePageLayout = ({ title, description, image, features }: { title: string, description: string, image: string, features: string[] }) => (
  <div className="min-h-screen bg-white pt-20 pb-20 font-sans animate-fade-in">
    <div className="relative h-[400px] bg-gray-900 overflow-hidden">
      <img src={image} alt={title} className="w-full h-full object-cover opacity-60" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end pb-16 px-6 md:px-12">
        <div className="max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-4">{title}</h1>
          <p className="text-lg text-gray-200 max-w-2xl">{description}</p>
        </div>
      </div>
    </div>
    <div className="max-w-4xl mx-auto px-6 md:px-12 py-16">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Features & Solutions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature, idx) => (
          <div key={idx} className="flex items-start gap-3 p-4 border border-gray-100 rounded-xl hover:border-brand-pink/30 hover:bg-pink-50/30 transition-all">
            <div className="w-2 h-2 mt-2 rounded-full bg-brand-pink shrink-0"></div>
            <p className="text-gray-600">{feature}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const WaterproofingPage = () => (
  <ServicePageLayout 
    title="Waterproofing Services"
    description="Advanced protection for your structures against water damage, leakage, and dampness using cutting-edge materials."
    image="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=2000&fit=crop"
    features={[
      "Terrace & Roof Waterproofing with UV-resistant coatings.",
      "Basement waterproofing using crystalline technology.",
      "Bathroom and wet area sealing.",
      "External wall waterproofing to prevent dampness."
    ]}
  />
);

export const PolyurethaneSealingPage = () => (
  <ServicePageLayout 
    title="Polyurethane Sealing"
    description="High-performance joint sealants and coatings for industrial and commercial applications requiring flexibility and durability."
    image="https://images.unsplash.com/photo-1632759145351-1d592919f522?q=80&w=2000&fit=crop"
    features={[
      "Expansion joint sealing for large structures.",
      "PU injection grouting for crack repairs.",
      "Traffic coating systems for car parks.",
      "Chemical resistant sealants for industrial floors."
    ]}
  />
);

export const IndustrialPipingPage = () => (
  <ServicePageLayout 
    title="Industrial Piping"
    description="Precision engineering for fluid transport systems, ensuring safety, efficiency, and compliance with industry standards."
    image="https://images.unsplash.com/photo-1542013936693-884638332954?q=80&w=2000&fit=crop"
    features={[
      "Fabrication and installation of process piping.",
      "Steam, gas, and compressed air line systems.",
      "Hydraulic piping for heavy machinery.",
      "Regular maintenance and leakage testing."
    ]}
  />
);

export const ConstructionPage = () => (
  <ServicePageLayout 
    title="Construction Services"
    description="End-to-end general contracting for residential, commercial, and industrial projects."
    image="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2000&fit=crop"
    features={[
      "Turnkey construction for villas and apartments.",
      "Structural steel fabrication and erection.",
      "Renovation and remodeling services.",
      "Civil works for industrial foundations."
    ]}
  />
);

export const InstrumentRepairPage = () => (
  <ServicePageLayout 
    title="Instrument Repair & Calibration"
    description="Expert servicing for precision surveying instruments to ensure 100% accuracy in your field measurements."
    image="https://images.unsplash.com/photo-1581094794329-cd1361d78571?q=80&w=2000&fit=crop"
    features={[
      "Calibration of Total Stations and Theodolites.",
      "Auto Level and Laser Level repair services.",
      "Firmware updates and software support.",
      "NABL traceable calibration certificates."
    ]}
  />
);
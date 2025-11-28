import { Project, FilterCategory } from './types';

export const FILTERS: FilterCategory[] = [
  { label: 'All Services', value: 'all' },
  { label: 'Waterproofing', value: 'waterproofing' },
  { label: 'Construction', value: 'construction' },
  { label: 'Piping', value: 'piping' },
  { label: 'Electrical', value: 'electrical' },
  { label: 'Civil Instruments', value: 'instruments' },
];

export const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2000&auto=format&fit=crop", // Construction
  "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=2000&auto=format&fit=crop", // Waterproofing/Roof
  // Removed 3rd image
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2000&auto=format&fit=crop", // Modern Architecture/High Rise
  // Removed 5th image
  "https://blog.openplot.com/wp-content/uploads/2025/06/Rainy-Season-Home-.webp"  // New: House protected by umbrella in rain
];

export const BEFORE_AFTER_DATA: any = {
  "Waterproofing": [
    { before: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=600&fit=crop", after: "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?q=80&w=600&fit=crop", label: "Terrace Leakage", desc: "Complete sealing of porous concrete surfaces." },
    { before: "https://images.unsplash.com/photo-1595846519845-68e298c2edd8?q=80&w=600&fit=crop", after: "https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=600&fit=crop", label: "Wall Seepage", desc: "Anti-fungal coating and moisture barrier." },
    { before: "https://images.unsplash.com/photo-1632759145351-1d592919f522?q=80&w=600&fit=crop", after: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=600&fit=crop", label: "Basement Cracks", desc: "Injection grouting for deep structural repair." },
    { before: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=600&fit=crop", after: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&fit=crop", label: "Roof Coating", desc: "Heat-reflective polyurethane finish." },
    { before: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=600&fit=crop", after: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=600&fit=crop", label: "Joint Sealing", desc: "Flexible sealants for expansion joints." },
    { before: "https://images.unsplash.com/photo-1590059390047-580471c90369?q=80&w=600&fit=crop", after: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=600&fit=crop", label: "Tank Proofing", desc: "Food-grade epoxy coating for water tanks." }
  ],
  "Construction": [
    { before: "https://images.unsplash.com/photo-1591955506264-3f51322179a7?q=80&w=600&fit=crop", after: "https://images.unsplash.com/photo-1600596542815-2a429b08e619?q=80&w=600&fit=crop", label: "Villa Project", desc: "From barren land to luxury residence." },
    { before: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=600&fit=crop", after: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=600&fit=crop", label: "Commercial Site", desc: "Steel structure erection and finishing." },
    { before: "https://images.unsplash.com/photo-1531834685032-c34bf0d84c7c?q=80&w=600&fit=crop", after: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&fit=crop", label: "High Rise", desc: "Multi-story reinforced concrete frame." },
    { before: "https://images.unsplash.com/photo-1590642916589-592340081373?q=80&w=600&fit=crop", after: "https://images.unsplash.com/photo-1460317442991-0ec209397118?q=80&w=600&fit=crop", label: "Foundation Work", desc: "Deep piling and raft foundation." },
    { before: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=600&fit=crop", after: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=600&fit=crop", label: "Renovation", desc: "Complete structural and aesthetic overhaul." },
    { before: "https://images.unsplash.com/photo-1429497419816-9ca5cfb4571a?q=80&w=600&fit=crop", after: "https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=600&fit=crop", label: "Interiors", desc: "Modern finishing and layout optimization." }
  ],
  "Piping": [
    { before: "https://images.unsplash.com/photo-1542013936693-884638332954?q=80&w=600&fit=crop", after: "https://images.unsplash.com/photo-1565514020176-11f8798e1a17?q=80&w=600&fit=crop", label: "Rusted Pipeline", desc: "Replacement with corrosion-resistant alloys." },
    { before: "https://images.unsplash.com/photo-1599392336306-05634b077a56?q=80&w=600&fit=crop", after: "https://images.unsplash.com/photo-1532635241-17e820acc59f?q=80&w=600&fit=crop", label: "Industrial Valves", desc: "Installation of automated control valves." },
    { before: "https://images.unsplash.com/photo-1518709414768-a88981a4515d?q=80&w=600&fit=crop", after: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=600&fit=crop", label: "Factory Setup", desc: "Process piping for manufacturing units." },
    { before: "https://images.unsplash.com/photo-1527011046414-4781f1f94f8c?q=80&w=600&fit=crop", after: "https://images.unsplash.com/photo-1621905252507-b35492cc7471?q=80&w=600&fit=crop", label: "Drainage System", desc: "High-capacity waste management systems." },
    { before: "https://images.unsplash.com/photo-1605218456194-d1685dc4220b?q=80&w=600&fit=crop", after: "https://images.unsplash.com/photo-1581092921461-eab62e97a783?q=80&w=600&fit=crop", label: "Gas Lines", desc: "Safety-compliant industrial gas piping." },
    { before: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=600&fit=crop", after: "https://images.unsplash.com/photo-1581093588402-4114d5e7a9e6?q=80&w=600&fit=crop", label: "Cooling Towers", desc: "Integration with HVAC piping networks." }
  ],
  "Electrical": [
    { before: "https://images.unsplash.com/photo-1555964082-f5c7170c776e?q=80&w=600&fit=crop", after: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600&fit=crop", label: "Panel Wiring", desc: "Organized structured cabling systems." },
    { before: "https://images.unsplash.com/photo-1517420879524-86d64ac2f339?q=80&w=600&fit=crop", after: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=600&fit=crop", label: "Grid Setup", desc: "High-voltage distribution grid implementation." },
    { before: "https://images.unsplash.com/photo-1563293846-9d2613ce474f?q=80&w=600&fit=crop", after: "https://images.unsplash.com/photo-1487800940032-1b611d574879?q=80&w=600&fit=crop", label: "Lighting Install", desc: "Energy-efficient LED commercial lighting." },
    { before: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=600&fit=crop", after: "https://images.unsplash.com/photo-1513530534585-c7b1394c6d51?q=80&w=600&fit=crop", label: "Safety Systems", desc: "Fire alarm and emergency shutdown systems." },
    { before: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=600&fit=crop", after: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=600&fit=crop", label: "Server Room", desc: "Precision power for data centers." },
    { before: "https://images.unsplash.com/photo-1516937941348-c09645f31e88?q=80&w=600&fit=crop", after: "https://images.unsplash.com/photo-1558002038-1091a1661116?q=80&w=600&fit=crop", label: "Automation", desc: "Smart building control integration." }
  ],
  "Civil Instruments": [
    { before: "https://images.unsplash.com/photo-1581093588402-4114d5e7a9e6?q=80&w=600&fit=crop", after: "https://images.unsplash.com/photo-1581094794329-cd1361d78571?q=80&w=600&fit=crop", label: "Total Station", desc: "Precision calibration for 1-second accuracy." },
    { before: "https://images.unsplash.com/photo-1580983561371-7f4b242d8ec0?q=80&w=600&fit=crop", after: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=600&fit=crop", label: "Theodolite", desc: "Lens alignment and axis adjustment." },
    { before: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=600&fit=crop", after: "https://images.unsplash.com/photo-1581092335397-9583eb92d232?q=80&w=600&fit=crop", label: "Laser Level", desc: "Beam alignment for perfect leveling." },
    { before: "https://images.unsplash.com/photo-1535732759880-bbd5c7265e3f?q=80&w=600&fit=crop", after: "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?q=80&w=600&fit=crop", label: "Calibration Lab", desc: "ISO standard certification process." },
    { before: "https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?q=80&w=600&fit=crop", after: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?q=80&w=600&fit=crop", label: "Dumpy Level", desc: "Bubble tube replacement and setting." },
    { before: "https://images.unsplash.com/photo-1581093588402-4114d5e7a9e6?q=80&w=600&fit=crop", after: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=600&fit=crop", label: "GPS Rover", desc: "Firmware update and signal fixing." }
  ]
};

// Ensure keys exist to prevent errors in other components if data was shortened above
if (!BEFORE_AFTER_DATA["Construction"]) BEFORE_AFTER_DATA["Construction"] = [];
if (!BEFORE_AFTER_DATA["Piping"]) BEFORE_AFTER_DATA["Piping"] = [];
if (!BEFORE_AFTER_DATA["Electrical"]) BEFORE_AFTER_DATA["Electrical"] = [];
if (!BEFORE_AFTER_DATA["Civil Instruments"]) BEFORE_AFTER_DATA["Civil Instruments"] = [];


export const PROJECTS: Project[] = [
  // Keeping existing small projects array for the footer slider
  {
    id: '1', title: 'Commercial Terrace', category: 'Waterproofing', imageUrl: 'https://images.unsplash.com/photo-1632759145351-1d592919f522?q=80&w=800&auto=format&fit=crop',
    author: { name: 'NK Expert Team', avatarUrl: 'https://ui-avatars.com/api/?name=NK&background=0D8ABC&color=fff', type: 'Team' }, stats: { likes: 45, views: 1200 }
  },
  // ... (truncated for brevity, logic remains)
];


// --- NEW DETAILED PROJECT DATA FOR PROJECTS PAGE ---
export const DETAILED_PROJECTS = Array.from({ length: 10 }).map((_, index) => {
  const categories = ['Waterproofing', 'Construction', 'Piping', 'Electrical', 'Civil Instruments'];
  const category = categories[index % categories.length];
  
  return {
    id: `proj-${index + 1}`,
    title: `${category} Project: ${['Skyline Tower', 'Green Valley Villa', 'Tech Park Phase 1', 'Industrial Hub', 'Metro Station', 'Lakeside Resort'][index % 6]}`,
    location: ['Bengaluru, KA', 'Mysuru, KA', 'Hubli, KA', 'Mangaluru, KA'][index % 4],
    category,
    problem: `The client faced severe issues related to ${category.toLowerCase()} failures. Water seepage was compromising structural integrity, causing dampness and mold growth. Previous repairs by local contractors had failed within months due to poor material selection and lack of root-cause analysis.`,
    solution: `NK Fearless Solutions implemented a comprehensive ${category} strategy. We utilized industrial-grade polyurethane sealants and reinforced the core structure. Our team conducted a 4-step process: Inspection, Surface Prep, Application, and Quality Testing, ensuring a 10-year leak-proof guarantee.`,
    images: [
      { 
        before: "https://images.unsplash.com/photo-1632759145351-1d592919f522?q=80&w=600&fit=crop", 
        after: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=600&fit=crop", 
        label: "Structural Crack" 
      },
      { 
        before: "https://images.unsplash.com/photo-1595846519845-68e298c2edd8?q=80&w=600&fit=crop", 
        after: "https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=600&fit=crop", 
        label: "Surface Damage" 
      },
      { 
        before: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=600&fit=crop", 
        after: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&fit=crop", 
        label: "Water Logged Area" 
      },
      { 
        before: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=600&fit=crop", 
        after: "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?q=80&w=600&fit=crop", 
        label: "Final Finishing" 
      }
    ]
  };
});
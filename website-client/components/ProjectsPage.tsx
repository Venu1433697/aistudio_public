import React, { useState } from 'react';
import { DETAILED_PROJECTS } from '../constants';

// Reusable Before/After Card Component for this page
const ProjectComparisonCard = ({ before, after, label, isMain = false }: { before: string, after: string, label: string, isMain?: boolean }) => (
  <div className={`relative w-full ${isMain ? 'h-64 md:h-80' : 'h-48'} rounded-lg overflow-hidden shadow-sm group`}>
    {/* Vertical Split: 50% Top Before, 50% Bottom After */}
    <div className="absolute top-0 left-0 w-full h-1/2 border-b border-white/50 overflow-hidden">
       <img src={before} alt="Before" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
       <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded font-bold uppercase backdrop-blur-sm">Before</div>
    </div>
    <div className="absolute bottom-0 left-0 w-full h-1/2 overflow-hidden">
       <img src={after} alt="After" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
       <div className="absolute bottom-2 right-2 bg-brand-pink/90 text-white text-[10px] px-2 py-0.5 rounded font-bold uppercase shadow-sm">After</div>
    </div>
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="h-0.5 w-full bg-white/30 shadow-sm"></div>
    </div>
    <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <p className="text-white text-xs text-center font-medium">{label}</p>
    </div>
  </div>
);

const ProjectsPage: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<typeof DETAILED_PROJECTS[0] | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Waterproofing', 'Construction', 'Piping', 'Electrical', 'Civil Instruments'];

  const filteredProjects = selectedCategory === 'All'
    ? DETAILED_PROJECTS
    : DETAILED_PROJECTS.filter(project => project.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50 animate-fade-in font-sans">
      
      {/* Hero Header */}
      <div className="bg-brand-dark text-white py-16 px-6 text-center relative overflow-hidden">
         <div className="absolute inset-0 opacity-20">
             <img src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2000&fit=crop" className="w-full h-full object-cover" />
         </div>
         <div className="relative z-10 max-w-3xl mx-auto">
            <h1 className="font-serif text-3xl md:text-5xl font-bold mb-3">Our Projects</h1>
            <p className="text-gray-300 text-base md:text-lg">Real challenges. Fearless solutions. Explore our portfolio.</p>
         </div>
      </div>

      {/* Filter Navigation */}
      <div className="sticky top-20 z-40 bg-gray-50/95 backdrop-blur border-b border-gray-200 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 md:px-12 overflow-x-auto no-scrollbar">
            <div className="flex md:justify-center gap-3 min-w-max">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 whitespace-nowrap ${
                            selectedCategory === cat
                            ? 'bg-brand-pink text-white shadow-md transform scale-105'
                            : 'bg-white text-gray-600 border border-gray-200 hover:border-brand-pink hover:text-brand-pink'
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
         {filteredProjects.length > 0 ? (
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {filteredProjects.map((project) => (
                    <div key={project.id} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1 flex flex-col h-full animate-fade-in-up">
                        {/* Top Image Section (Shows 1st pair) */}
                        <div className="relative h-80 w-full group cursor-pointer" onClick={() => setSelectedProject(project)}>
                            {/* Use the first image pair as the cover */}
                            <div className="absolute inset-0 flex">
                                <div className="w-1/2 h-full relative border-r-2 border-white">
                                    <img src={project.images[0].before} className="w-full h-full object-cover filter brightness-90 group-hover:brightness-100 transition-all" />
                                    <div className="absolute top-4 left-4 bg-black/70 text-white text-xs font-bold px-3 py-1 rounded backdrop-blur-md border border-white/10">BEFORE</div>
                                </div>
                                <div className="w-1/2 h-full relative">
                                    <img src={project.images[0].after} className="w-full h-full object-cover filter brightness-90 group-hover:brightness-100 transition-all" />
                                    <div className="absolute bottom-4 right-4 bg-brand-pink text-white text-xs font-bold px-3 py-1 rounded shadow-lg">AFTER</div>
                                </div>
                            </div>
                            {/* Center Badge */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="bg-white/90 backdrop-blur text-brand-dark text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg transform scale-90 group-hover:scale-110 transition-transform">
                                    Transformation
                                </div>
                            </div>
                        </div>

                        {/* Bottom Content Section */}
                        <div className="p-8 flex-grow flex flex-col">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <span className="text-brand-pink text-xs font-bold uppercase tracking-wider">{project.category}</span>
                                    <h3 className="text-2xl font-serif font-bold text-gray-900 mt-1 leading-tight group-hover:text-brand-pink transition-colors cursor-pointer" onClick={() => setSelectedProject(project)}>{project.title}</h3>
                                    <p className="text-gray-500 text-sm flex items-center gap-1 mt-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        {project.location}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="mt-auto pt-6 border-t border-gray-100">
                                <button 
                                    onClick={() => setSelectedProject(project)}
                                    className="w-full py-3 border-2 border-brand-dark text-brand-dark font-bold rounded-full hover:bg-brand-dark hover:text-white transition-all flex items-center justify-center gap-2 group"
                                >
                                    View Case Study
                                    <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
             </div>
         ) : (
             <div className="text-center py-20">
                 <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                 </div>
                 <h3 className="text-lg font-medium text-gray-500">No projects found for <span className="text-brand-dark font-bold">{selectedCategory}</span> yet.</h3>
                 <button onClick={() => setSelectedCategory('All')} className="mt-4 text-brand-pink font-bold text-sm hover:underline">View All Projects</button>
             </div>
         )}
      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setSelectedProject(null)}></div>
            
            <div className="relative bg-white w-full max-w-6xl h-full max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-fade-in-up">
                <button 
                    onClick={() => setSelectedProject(null)}
                    className="absolute top-4 right-4 z-50 bg-white hover:bg-gray-200 text-black p-2 rounded-full transition-colors shadow-md"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

                {/* Left Panel: Info */}
                <div className="w-full md:w-1/3 bg-gray-50 p-8 md:p-12 border-r border-gray-200 overflow-y-auto">
                    <span className="bg-brand-pink text-white px-3 py-1 rounded text-xs font-bold uppercase tracking-wider">{selectedProject.category}</span>
                    <h2 className="font-serif text-3xl font-bold text-gray-900 mt-4 mb-2">{selectedProject.title}</h2>
                    <p className="text-gray-500 flex items-center gap-2 mb-8">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        {selectedProject.location}
                    </p>

                    <div className="space-y-8">
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                            <h3 className="text-red-600 font-bold uppercase text-xs tracking-widest mb-3 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-red-600"></span> The Problem
                            </h3>
                            <p className="text-gray-700 leading-relaxed text-sm">{selectedProject.problem}</p>
                        </div>

                        <div className="bg-brand-dark p-6 rounded-xl shadow-lg text-white">
                            <h3 className="text-green-400 font-bold uppercase text-xs tracking-widest mb-3 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-400"></span> NK Solution
                            </h3>
                            <p className="text-gray-300 leading-relaxed text-sm">{selectedProject.solution}</p>
                        </div>
                    </div>
                </div>

                {/* Right Panel: Gallery */}
                <div className="w-full md:w-2/3 p-8 md:p-12 bg-white overflow-y-auto">
                    <h3 className="font-bold text-xl text-gray-900 mb-8 border-b border-gray-100 pb-4">Transformation Gallery</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {selectedProject.images.map((img, idx) => (
                            <div key={idx} className="space-y-2">
                                <ProjectComparisonCard 
                                    before={img.before} 
                                    after={img.after} 
                                    label={img.label}
                                    isMain={true} 
                                />
                                <p className="text-center text-xs font-bold text-gray-500 uppercase tracking-wider">{img.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      )}

    </div>
  );
};

export default ProjectsPage;
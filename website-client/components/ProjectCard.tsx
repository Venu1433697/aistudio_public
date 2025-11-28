import React, { useState } from 'react';
import { Project } from '../types';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
        className="flex flex-col gap-2 group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden cursor-pointer">
        <img 
          src={project.imageUrl} 
          alt={project.title} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Hover Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-5 transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex justify-between items-end">
            <span className="text-white font-semibold text-lg truncate w-2/3 shadow-sm">{project.title}</span>
            <div className="flex gap-2">
                <button className="bg-white text-gray-800 p-2 rounded-lg hover:bg-gray-100 transition-colors shadow-md" title="Save">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                </button>
                <button className="bg-white text-gray-800 p-2 rounded-lg hover:bg-gray-100 transition-colors shadow-md" title="Like">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                </button>
            </div>
          </div>
        </div>
      </div>

      {/* Meta Data */}
      <div className="flex justify-between items-center text-xs text-gray-500 px-1">
        <div className="flex items-center gap-2 cursor-pointer hover:text-black">
          <img src={project.author.avatarUrl} alt={project.author.name} className="w-6 h-6 rounded-full object-cover" />
          <span className="font-semibold text-gray-900">{project.author.name}</span>
          {project.author.type === 'Team' && (
             <span className="bg-gray-200 text-gray-600 px-1 rounded text-[10px] font-bold">TEAM</span>
          )}
          {project.author.type === 'Pro' && (
             <span className="bg-gray-200 text-gray-600 px-1 rounded text-[10px] font-bold">PRO</span>
          )}
        </div>
        <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 hover:text-brand-pink transition-colors cursor-pointer">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                <span>{project.stats.likes}</span>
            </div>
            <div className="flex items-center gap-1 hover:text-brand-pink transition-colors cursor-pointer">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                <span>{((project.stats.views / 1000).toFixed(1))}k</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;

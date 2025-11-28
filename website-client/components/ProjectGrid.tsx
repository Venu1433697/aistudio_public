
import React from 'react';
import ProjectCard from './ProjectCard';
import { Project } from '../types';

interface ProjectGridProps {
  projects: Project[];
}

const ProjectGrid: React.FC<ProjectGridProps> = ({ projects }) => {
  return (
    <div className="px-6 md:px-12 py-8">
      {projects.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-8">
            {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
            ))}
        </div>
      ) : (
        <div className="text-center py-20">
            <h3 className="text-xl font-medium text-gray-600">No projects found for this category.</h3>
            <p className="text-gray-400 mt-2">Try selecting a different filter.</p>
        </div>
      )}

      <div className="mt-16 flex justify-center mb-10">
        <button className="bg-white text-black border border-gray-200 px-6 py-3 rounded-full font-medium text-sm hover:border-gray-300 hover:bg-gray-50 transition-all shadow-sm">
            Load more work
        </button>
      </div>
    </div>
  );
};

export default ProjectGrid;

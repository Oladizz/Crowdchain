
import React from 'react';
import { Link } from 'react-router-dom';
import { Project } from '../context/types';
import ProgressBar from './ProgressBar';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const percentage = Math.round((project.amountRaised / project.fundingGoal) * 100);
  const daysLeft = Math.ceil((new Date(project.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <Link to={`/project/${project.id}`} className="flex flex-col bg-brand-surface/60 backdrop-blur-lg border border-white/10 rounded-xl overflow-hidden shadow-lg hover:shadow-brand-blue/30 transition-shadow duration-300 transform hover:-translate-y-1 h-full group">
      {/* Image */}
      <div className="h-48 flex-shrink-0 overflow-hidden">
        <img className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" src={project.image} alt={project.name} />
      </div>

      {/* Content */}
      <div className="p-3 flex flex-col flex-grow">
        {/* Top section */}
        <div className="flex-grow">
          <p className="text-xs font-semibold text-brand-blue uppercase tracking-wide">{project.category}</p>
          <h3 className="mt-1 text-base font-semibold text-white line-clamp-2 group-hover:text-brand-blue-light transition-colors">{project.name}</h3>
          <p className="mt-2 text-xs text-brand-muted line-clamp-3">{project.description}</p>
        </div>
        
        {/* Bottom section */}
        <div className="mt-3 pt-2">
          <ProgressBar value={project.amountRaised} max={project.fundingGoal} />
          <div className="mt-2 flex justify-between text-xs">
            <span className="text-white font-bold">{percentage}% funded</span>
            <span className="text-brand-muted">{daysLeft > 0 ? `${daysLeft} days left` : 'Ended'}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;

import React, { useState, useMemo } from 'react';
import { motion, Variants } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt, FaCalendarAlt, FaCode } from 'react-icons/fa';
import { ProjectResponse } from '../../../services/useProjectService';
import dayjs from 'dayjs';
import { htmlToElement } from '../../../utils/helper';

interface TechItemProps {
  tech: {
    logoUrl?: string;
    logoName: string;
  };
}

const TechItem: React.FC<TechItemProps> = ({ tech }) => {
  const [imgError, setImgError] = useState(false);
  const showInitial = !tech.logoUrl || imgError;

  return (
    <div className="group/tech relative">
      <div 
        className="relative flex flex-col items-center rounded-lg p-1.5 transition-all duration-200 
                  hover:bg-gray-50 hover:shadow-sm hover:-translate-y-0.5"
        title={tech.logoName}
      >
        <div className="relative flex h-8 w-8 items-center justify-center">
          {!showInitial ? (
            <img
              src={tech.logoUrl}
              alt={tech.logoName}
              className="h-full w-full object-contain transition-transform duration-200 
                        group-hover/tech:scale-110"
              loading="lazy"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-md 
                          bg-gradient-to-br from-blue-50 to-blue-100 text-sm font-medium 
                          text-blue-600">
              {tech.logoName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <span 
          className="mt-1.5 line-clamp-1 w-full text-center text-[11px] font-medium 
                    text-gray-600 transition-colors group-hover/tech:text-gray-900"
        >
          {tech.logoName}
        </span>
      </div>
      {/* Tooltip */}
      <div 
        className="pointer-events-none absolute -top-9 left-1/2 z-10 -translate-x-1/2 transform whitespace-nowrap 
                  rounded-md bg-gray-900 px-2 py-1 text-xs font-medium text-white opacity-0 shadow-lg 
                  transition-all duration-200 group-hover/tech:pointer-events-auto 
                  group-hover/tech:-top-10 group-hover/tech:opacity-100"
      >
        {tech.logoName}
        <div 
          className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 transform bg-gray-900"
          aria-hidden="true"
        />
      </div>
    </div>
  );
};

interface ProjectCardProps {
  project: ProjectResponse;
}

const COLORS = {
  primary: '#1A56DB',
  primaryLight: '#EBF5FF',
  textPrimary: '#111827',
  textSecondary: '#4B5563',
  border: '#E5E7EB',
  background: '#FFFFFF',
  success: '#10B981',
  accent: '#10B981',
} as const;

// Animation variants
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1],
      when: 'beforeChildren',
      staggerChildren: 0.1
    }
  },
  hover: {
    y: -8,
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 15,
      mass: 0.5
    }
  },
  tap: { 
    scale: 0.98,
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
  }
};

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const isCurrent = project.projectEndDate ? new Date(project.projectEndDate) > new Date() : false;

  const getDomain = (url: string) => {
    try {
      const domain = new URL(url).hostname.replace('www.', '');
      return domain.split('.')[0];
    } catch {
      return 'Visit';
    }
  };

  const formatDate = useMemo(() => (dateString: string | null | undefined): string => {
    if (!dateString) return 'Present';
    try {
      return dayjs(dateString).format('MMM YYYY');
    } catch {
      return 'Present';
    }
  }, []);

  const formatDateRange = useMemo(() => 
    (startDate?: string | null, endDate?: string | null) => {
      if (!startDate) return 'Date not specified';
      return `${formatDate(startDate)} - ${endDate ? formatDate(endDate) : 'Present'}`;
    }, 
    [formatDate]
  );

  return (
    <motion.article
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      whileTap="tap"
      className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white 
                shadow-sm transition-all duration-300 hover:shadow-lg"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Header */}
      <header className="relative border-b border-gray-100 p-5">
        <div className="flex items-start gap-4">
          <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-blue-50 to-blue-100">
            {project.projectImageUrl && !imageError ? (
              <img
                src={project.projectImageUrl}
                alt={project.projectName}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={() => setImageError(true)}
                loading="lazy"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <FaCode className="text-xl text-blue-600" />
              </div>
            )}
          </div>
          
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-lg font-semibold text-gray-900">
              {project.projectName}
            </h3>
            
            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-gray-500">
              <div className="flex items-center gap-1.5">
                <FaCalendarAlt className="h-3.5 w-3.5" />
                <span>{formatDateRange(project.projectStartDate?.toString(), project.projectEndDate?.toString())}</span>
              </div>
              
              {isCurrent && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                  Active
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <p className="text-gray-600 line-clamp-3">
          {htmlToElement(project.projectDescription)}
        </p>
        
        {/* Project Links */}
        <div className="mt-4 flex flex-wrap gap-3 pt-2">
          {project.projectLink && (
            <a
              href={project.projectLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-gray-50 px-3 py-1.5 text-sm font-medium 
                         text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900"
            >
              <FaGithub className="h-4 w-4" />
              <span>GitHub</span>
              <span className="text-xs text-gray-400">
                {getDomain(project.projectLink)}
              </span>
            </a>
          )}
          
          {project.projectLink && (
            <a
              href={project.projectLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 text-sm font-medium 
                         text-blue-700 transition-colors hover:bg-blue-100 hover:text-blue-900"
            >
              <FaExternalLinkAlt className="h-3.5 w-3.5" />
              <span>Live Demo</span>
              <span className="text-xs text-blue-400">
                {getDomain(project.projectLink)}
              </span>
            </a>
          )}
        </div>
      </div>

      {/* Tech Stack */}
      {project.technologiesUsed?.length > 0 && (
        <footer className="border-t border-gray-100 p-5">
          <h4 className="mb-3 text-sm font-medium text-gray-500">Built with</h4>
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-5 md:grid-cols-6">
            {project.technologiesUsed.map((tech, index) => (
              <TechItem key={`${tech.logoName}-${index}`} tech={tech} />
            ))}
          </div>
        </footer>
      )}
    </motion.article>
  );
};

export default React.memo(ProjectCard);
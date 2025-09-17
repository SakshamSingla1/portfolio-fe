import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProjectResponse } from "../../../services/useProjectService";
import { FiGithub, FiExternalLink, FiX, FiInfo, FiCode, FiCalendar, FiImage } from "react-icons/fi";
import { format, isAfter, isBefore, parseISO } from 'date-fns';
import { htmlToElement } from "../../../utils/helper";


interface ProjectCardProps {
  project: ProjectResponse;
  index?: number;
  className?: string;
  onViewDetails?: (projectId: string) => void;
}

// Format date to a readable string
const formatDate = (dateString: string | Date | null): string => {
  if (!dateString) return 'Present';
  const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
  return format(date, 'MMM yyyy');
};

// Check if project is currently active
const isProjectActive = (startDate: string | Date, endDate: string | Date | null): boolean => {
  if (!endDate) return true;
  const now = new Date();
  const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
  const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;
  return isAfter(now, start) && isBefore(now, end);
};

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  index = 0,
  className = "",
  onViewDetails,
}) => {
  const container = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imgError, setImgError] = useState(false);

  const hasLinks = project.projectLink;
  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;

  const handleImageError = () => {
    setImgError(true);
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onViewDetails && project.id) {
      onViewDetails(project.id.toString());
    } else {
      setIsModalOpen(true);
    }
  };

  const renderTechStack = () => {
    if (!project.technologiesUsed?.length) return null;

    return (
      <div>
        <h4 className="text-xs font-medium text-gray-400 mb-2 flex items-center gap-1">
          <FiCode className="w-3.5 h-3.5" />
          <span>Technologies</span>
        </h4>
        <div className="flex flex-wrap gap-2">
          {project.technologiesUsed.map((tech, i) => (
            <div
              key={`${tech.logoName}-${i}`}
              className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-gray-800/80 text-gray-200 border border-gray-700/50"
              title={tech.logoName}
            >
              <img src={tech.logoUrl} alt={tech.logoName} className="w-4 h-4" />
              {tech.logoName}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderProjectDates = () => {
    const startDate = project.projectStartDate ? formatDate(project.projectStartDate) : null;
    const endDate = project.currentlyWorking || !project.projectEndDate
      ? 'Present'
      : formatDate(project.projectEndDate);

    const isActive = project.currentlyWorking ||
      isProjectActive(project.projectStartDate, project.projectEndDate);

    return (
      <div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <FiCalendar className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{startDate} - {endDate}</span>
          {isActive && (
            <span className="flex items-center gap-1 ml-2 px-2 py-0.5 bg-green-500/10 text-green-400 rounded-full text-[10px] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
              Active
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      ref={container}
      className={`relative h-full w-full transition-all duration-300 ${className}`}
      onMouseEnter={() => !isMobile && setIsHovered(true)}
      onMouseLeave={() => !isMobile && setIsHovered(false)}
      onClick={handleViewDetails}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${project.projectName}`}
    >
      <motion.div
        className="h-full w-full bg-gray-900 rounded-xl overflow-hidden shadow-2xl transition-all duration-300 hover:shadow-2xl hover:shadow-gray-900/30"
        whileHover={{ y: -5 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* Image Container */}
        <div className="relative w-full h-48 md:h-56 lg:h-64 overflow-hidden group">
          {!imgError && project.projectImageUrl ? (
            <>
              <motion.img
                src={project.projectImageUrl}
                alt={project.projectName}
                className={`w-full h-full object-cover transition-transform duration-700 ${isImageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                onLoad={() => setIsImageLoaded(true)}
                onError={handleImageError}
                initial={{ scale: 1 }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
              />
              {!isImageLoaded && (
                <div className="absolute inset-0 bg-gray-800 animate-pulse" />
              )}
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"
                initial={{ opacity: 0.5 }}
                animate={{ opacity: isHovered ? 0.8 : 0.5 }}
                transition={{ duration: 0.3 }}
              />
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
              <span className="text-gray-500 text-sm">No preview available</span>
            </div>
          )}

          <div className="absolute top-2 right-2 flex items-center gap-2">
            {project.projectLink && (
              <motion.a
                href={project.projectLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-900/80 backdrop-blur-sm border border-gray-700 hover:bg-gray-800 transition-colors"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                aria-label="View on GitHub"
                title="View on GitHub"
              >
                <FiGithub className="w-4 h-4 text-gray-300" />
              </motion.a>
            )}
            {project.projectLink && (
              <motion.a
                href={project.projectLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-900/80 backdrop-blur-sm border border-gray-700 hover:bg-gray-800 transition-colors"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                aria-label="View on Project"
                title="View on Project"
              >
                <FiExternalLink className="w-4 h-4 text-gray-300" />
              </motion.a>
            )}
          </div>

          <div className="absolute bottom-0 left-0 backdrop-blur-sm p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-lg md:text-xl font-bold text-white line-clamp-1">
                  {project.projectName}
                </h3>
              </div>
              {renderProjectDates()}
            </div>
          </div>
          </div>

          {/* View Details Button */}
          <motion.div
            className="absolute bottom-2 right-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{
              opacity: isHovered || isMobile ? 1 : 0,
              y: isHovered || isMobile ? 0 : 10
            }}
            transition={{ duration: 0.2 }}
          >
            <button
              className="flex items-center gap-2 px-2 py-2 bg-white/10 backdrop-blur-md rounded-full text-white text-sm font-medium hover:bg-white/20 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                handleViewDetails(e);
              }}
            >
              <FiInfo className="w-4 h-4" />
            </button>
          </motion.div>
        </div>

        {/* Content */}
        <div className="p-5 md:p-6">
          {/* Tech Stack */}
          {renderTechStack()}
        </div>
      </motion.div>

      {/* Enhanced Project Details Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ 
              opacity: 1, 
              backdropFilter: 'blur(8px)',
              transition: { duration: 0.3 }
            }}
            exit={{ 
              opacity: 0, 
              backdropFilter: 'blur(0px)',
              transition: { duration: 0.2 }
            }}
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              className="relative bg-gray-900 rounded-2xl w-full max-w-5xl mx-auto my-8 overflow-hidden shadow-2xl border border-gray-800/50"
              initial={{ y: 20, opacity: 0, scale: 0.98 }}
              animate={{ 
                y: 0, 
                opacity: 1, 
                scale: 1,
                transition: { 
                  type: 'spring', 
                  damping: 25, 
                  stiffness: 500,
                  delay: 0.1
                }
              }}
              exit={{ 
                y: 20, 
                opacity: 0, 
                scale: 0.98,
                transition: { duration: 0.2 }
              }}
              onClick={(e) => e.stopPropagation()}
              style={{ maxHeight: 'calc(100vh - 4rem)' }}
            >
              {/* Close Button */}
              <motion.button
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-800/80 backdrop-blur-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-200 shadow-lg border border-gray-700/50"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsModalOpen(false)}
                aria-label="Close modal"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.3 } }}
                exit={{ opacity: 0, y: -10, transition: { duration: 0.1 } }}
              >
                <FiX className="w-5 h-5" />
              </motion.button>

              {/* Image Header */}
              <div className="relative h-64 md:h-96 w-full bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden">
                {project.projectImageUrl && !imgError ? (
                  <motion.img
                    src={project.projectImageUrl}
                    alt={project.projectName}
                    className="w-full h-full object-cover"
                    onError={handleImageError}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center p-6 max-w-md">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center text-gray-600">
                        <FiImage className="w-8 h-8" />
                      </div>
                      <p className="text-gray-400">No preview available</p>
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/20 to-transparent" />
                
                {/* Project Title Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 backdrop-blur-sm">
                  <motion.h2 
                    className="text-2xl md:text-4xl font-bold text-white mb-2 drop-shadow-lg"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {project.projectName}
                  </motion.h2>
                  
                  <motion.div 
                    className="flex items-center gap-2 text-sm text-gray-300"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.25 }}
                  >
                    <FiCalendar className="w-4 h-4 flex-shrink-0" />
                    <span>
                      {formatDate(project.projectStartDate)} - {
                        project.currentlyWorking || !project.projectEndDate
                          ? 'Present'
                          : formatDate(project.projectEndDate)
                      }
                    </span>
                    {(project.currentlyWorking || isProjectActive(project.projectStartDate, project.projectEndDate)) && (
                      <span className="flex items-center gap-1 ml-2 px-2 py-0.5 bg-green-500/10 text-green-400 rounded-full text-[11px] font-medium">
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                        Active
                      </span>
                    )}
                  </motion.div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 md:p-8 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 28rem)' }}>
                <div className="prose prose-invert max-w-none">
                  {/* Project Description */}
                  {project.projectDescription && (
                    <motion.div 
                      className="mb-8"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <h3 className="text-lg font-semibold text-gray-200 mb-3 pb-2 border-b border-gray-800">
                        Project Overview
                      </h3>
                      <div className="text-gray-300 leading-relaxed space-y-4">
                        {htmlToElement(project.projectDescription)}
                      </div>
                    </motion.div>
                  )}

                  {/* Technologies */}
                  {project.technologiesUsed && project.technologiesUsed.length > 0 && (
                    <motion.div 
                      className="mb-8"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35 }}
                    >
                      <h3 className="text-lg font-semibold text-gray-200 mb-3 pb-2 border-b border-gray-800">
                        Technologies Used
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {project.technologiesUsed.map((tech, i) => (
                          <motion.span
                            key={`tech-${i}`}
                            className="px-3 py-1.5 bg-gray-800/80 text-gray-200 text-xs rounded-lg border border-gray-700/50 flex items-center gap-2 transition-all hover:bg-gray-800 hover:border-gray-600/50"
                            title={tech.logoName}
                            whileHover={{ y: -2, scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 + (i * 0.03) }}
                          >
                            {tech.logoUrl && (
                              <img
                                src={tech.logoUrl}
                                alt={tech.logoName}
                                className="w-4 h-4 object-contain"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                }}
                              />
                            )}
                            <span>{tech.logoName}</span>
                          </motion.span>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Links */}
                  {project.projectLink && (
                    <motion.div 
                      className="pt-4 border-t border-gray-800"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <h3 className="text-lg font-semibold text-gray-200 mb-3">
                        Project Links
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        <motion.a
                          href={project.projectLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-white text-sm font-medium transition-all hover:-translate-y-0.5 shadow-lg hover:shadow-gray-900/30"
                          whileHover={{ y: -2 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <FiGithub className="w-4 h-4" />
                          <span>View on GitHub</span>
                        </motion.a>

                        <motion.a
                          href={project.projectLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-all hover:-translate-y-0.5 shadow-lg hover:shadow-blue-900/30"
                          whileHover={{ y: -2 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <FiExternalLink className="w-4 h-4" />
                          <span>Live Demo</span>
                        </motion.a>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
export default ProjectCard;


import React, { useRef } from 'react';
import { motion, useInView, Variants } from 'framer-motion';
import ProjectCard from '../../atoms/ProjectCard/ProjectCard';
import { ProjectResponse } from '../../../services/useProjectService';

interface ProjectTimelineProps {
  projects: ProjectResponse[];
}

const ProjectTimeline: React.FC<ProjectTimelineProps> = ({ 
  projects, 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.1 });

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        when: "beforeChildren"
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 0.77, 0.47, 0.97],
        delay: i * 0.1
      }
    })
  };

  if (!projects || projects.length === 0) {
    return null;
  }

  return (
    <div className={`relative`} ref={containerRef}>
      {/* Vertical line */}
      <div className="absolute left-1/2 h-full w-0.5 bg-gray-200 transform -translate-x-1/2"></div>
      
      <motion.div 
        className="relative space-y-20"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {projects.map((project, index) => {
          // Alternate between left and right alignment
          const isLeft = index % 2 === 0;
          
          return (
            <motion.div
              key={project.id || index}
              className={`flex ${isLeft ? 'flex-row' : 'flex-row-reverse'} items-center`}
              custom={index}
              variants={itemVariants}
            >
              {/* Project Card */}
              <div className={`w-5/12 ${isLeft ? 'pr-12' : 'pl-12'}`}>
                <ProjectCard 
                  project={project}
                />
              </div>
              
              {/* Timeline Dot */}
              <div className="w-2/12 flex justify-center">
                <motion.div 
                  className="w-6 h-6 rounded-full bg-primary-600 flex items-center justify-center z-10 relative"
                  initial={{ scale: 0 }}
                  animate={{ 
                    scale: 1,
                    transition: { 
                      type: 'spring',
                      stiffness: 500,
                      damping: 30,
                      delay: index * 0.1 + 0.3
                    } 
                  }}
                  whileHover={{ 
                    scale: 1.2,
                    backgroundColor: '#1A56DB',
                    transition: { duration: 0.2 }
                  }}
                >
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                  
                  {/* Date Badge */}
                  <div className={`absolute ${isLeft ? 'right-0 mr-10' : 'left-0 ml-10'} whitespace-nowrap bg-white px-3 py-1 rounded-full shadow-md text-sm font-medium text-gray-700`}>
                    {project.projectEndDate ? new Date(project.projectEndDate).getFullYear() : 'Present'}
                  </div>
                </motion.div>
              </div>
              
              {/* Empty space for alignment */}
              <div className={`w-5/12 ${isLeft ? 'pl-12' : 'pr-12'}`}></div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default ProjectTimeline;

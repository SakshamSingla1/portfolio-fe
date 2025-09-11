import React from 'react';
import { motion, Variants } from 'framer-motion';
import ProjectCard from '../../atoms/ProjectCard/ProjectCard';
import { ProjectResponse } from '../../../services/useProjectService';

interface ProjectTimelineProps {
  projects: ProjectResponse[];
}

const ProjectTimeline: React.FC<ProjectTimelineProps> = ({ projects }) => {
  // Animate immediately on mount

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        when: "beforeChildren"
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.98
    },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        damping: 15,
        stiffness: 100,
        delay: Math.floor(i / 3) * 0.1,
        when: "beforeChildren"
      }
    })
  };

  if (!projects || projects.length === 0) {
    return null;
  }

  // Group projects into rows of 3
  const rows = [];
  for (let i = 0; i < projects.length; i += 3) {
    rows.push(projects.slice(i, i + 3));
  }

  return (
    <div className="w-full">
      <motion.div 
        className="space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {rows.map((row, rowIndex) => (
          <motion.div 
            key={`row-${rowIndex}`}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            custom={rowIndex}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  when: "beforeChildren",
                  staggerChildren: 0.1
                }
              }
            }}
          >
            {row.map((project, colIndex) => {
              const index = rowIndex * 3 + colIndex;
              return (
                <motion.div 
                  key={project.id || index}
                  custom={index}
                  variants={itemVariants}
                  className="h-full"
                >
                  <ProjectCard 
                    project={project}
                  />
                </motion.div>
              );
            })}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default ProjectTimeline;

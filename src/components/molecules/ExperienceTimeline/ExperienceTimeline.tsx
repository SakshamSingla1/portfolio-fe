import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ExperienceResponse } from '../../../services/useExperienceService';
import ExperienceCard from '../../atoms/ExperienceCard/ExperienceCard';

interface ExperienceTimelineProps {
  experiences: ExperienceResponse[];
  className?: string;
}

const ExperienceTimeline: React.FC<ExperienceTimelineProps> = ({ 
  experiences, 
  className = '' 
}) => {
  if (!experiences || experiences.length === 0) {
    return null;
  }

  return (
    <div className={`relative ${className}`}>
      {/* Vertical line */}
      <div className="absolute left-1/2 h-full w-0.5 bg-gray-200 transform -translate-x-1/2"></div>
      
      <div className="relative space-y-12">
        {experiences.map((experience, index) => {
          // Alternate between left and right alignment
          const isLeft = index % 2 === 0;
          const ref = useRef(null);
          const isInView = useInView(ref, { once: true, amount: 0.3 });
          
          return (
            <motion.div
              ref={ref}
              key={experience.id || index}
              className={`flex ${isLeft ? 'flex-row' : 'flex-row-reverse'} items-center`}
              initial={{ 
                opacity: 0, 
                x: isLeft ? -50 : 50,
                y: 20 
              }}
              animate={{ 
                opacity: isInView ? 1 : 0,
                x: isInView ? 0 : (isLeft ? -50 : 50),
                y: isInView ? 0 : 20
              }}
              transition={{ 
                duration: 0.6, 
                ease: [0.16, 0.77, 0.47, 0.97],
                delay: index * 0.1 
              }}
            >
              {/* Card Container */}
              <div className={`w-5/12 ${isLeft ? 'pr-8' : 'pl-8'}`}>
                <ExperienceCard 
                  experience={experience} 
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
                    {experience.endDate ? new Date(experience.endDate).getFullYear() : 'Present'}
                  </div>
                </motion.div>
              </div>
              
              {/* Empty space for alignment */}
              <div className={`w-5/12 ${isLeft ? 'pl-8' : 'pr-8'}`}></div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ExperienceTimeline;

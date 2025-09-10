import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Education } from '../../../services/useEducationService';
import EducationCard from '../../atoms/EducationCard/EducationCard';

interface EducationTimelineProps {
  educations: Education[];
  className?: string;
}

const EducationTimeline: React.FC<EducationTimelineProps> = ({ 
  educations, 
  className = '' 
}) => {
  if (!educations || educations.length === 0) {
    return null;
  }

  return (
    <div className={`relative ${className}`}>
      {/* Vertical line */}
      <div className="absolute left-1/2 h-full w-0.5 bg-gray-200 transform -translate-x-1/2"></div>
      
      <div className="relative space-y-12">
        {educations.map((education, index) => {
          // Alternate between left and right alignment
          const isLeft = index % 2 === 0;
          const ref = useRef(null);
          const isInView = useInView(ref, { once: true, amount: 0.3 });
          
          return (
            <motion.div
              ref={ref}
              key={education.id || index}
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
                <EducationCard 
                  education={education} 
                  className="w-full"
                />
              </div>
              
              {/* Timeline Dot */}
              <div className="w-2/12 flex justify-center">
                <div className="w-6 h-6 rounded-full bg-primary-600 flex items-center justify-center z-10">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
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

export default EducationTimeline;

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Calendar, MapPin, ChevronDown, ChevronUp, Star } from 'lucide-react';
import { Education } from '../../../services/useEducationService';
import { htmlToElement, OptionToValue } from '../../../utils/helper';
import { DEGREE_OPTIONS } from '../../../utils/constant';
import { Variants } from 'framer-motion';

interface EducationCardProps {
  education: Education;
  className?: string;
  showDetails?: boolean;
  onToggleDetails?: () => void;
}

// Animation variants for the card
const cardVariants: Variants = {
  hidden: { y: 30, opacity: 0, scale: 0.98 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: 'easeOut' }
  },
  hover: {
    y: -5,
    boxShadow: '0 10px 15px -5px rgba(0, 0, 0, 0.1)',
    transition: { type: 'spring', stiffness: 300 }
  }
};

// Get appropriate emoji based on degree type
const getDegreeEmoji = (degree: string) => {
  const lowerDegree = degree.toLowerCase();
  
  if (lowerDegree.includes('bachelor') || lowerDegree.includes('b.tech')) return '🎓';
  if (lowerDegree.includes('master') || lowerDegree.includes('m.tech')) return '🎯';
  if (lowerDegree.includes('phd') || lowerDegree.includes('doctor')) return '👨‍🎓';
  if (lowerDegree.includes('diploma') || lowerDegree.includes('certificate')) return '📜';
  
  return '🏫';
};

const EducationCard: React.FC<EducationCardProps> = ({
  education,
  className = '',
  showDetails = false,
  onToggleDetails,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const hasDescription = !!education.description?.trim();
  const isExpandedState = onToggleDetails ? showDetails : isExpanded;

  const formatDateRange = (startYear: string, endYear?: string) => {
    return `${startYear} - ${endYear || 'Present'}`;
  };

  const progress = useMemo(() => {
    if (!education.startYear) return 0;
    const startYear = parseInt(education.startYear.toString(), 10);
    const endYear = education.endYear ? parseInt(education.endYear.toString(), 10) : new Date().getFullYear();
    
    const start = new Date(startYear, 0, 1).getTime();
    const end = education.endYear 
      ? new Date(endYear, 11, 31).getTime() 
      : Date.now(); 
      
    const total = end - start;
    const elapsed = Date.now() - start;
    return Math.min(100, Math.max(0, (elapsed / total) * 100));
  }, [education.startYear, education.endYear]);

  const handleToggleDetails = () => {
    onToggleDetails ? onToggleDetails() : setIsExpanded(!isExpanded);
  };

  return (
    <motion.article
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className={`relative border rounded-xl p-6 bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm ${
        isHovered ? 'border-teal-500' : 'border-gray-700'
      } ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute top-1 left-0 right-0 h-2 bg-gray-700 mx-2 overflow-hidden">
        <motion.div 
          className="h-full w-full rounded-full bg-gradient-to-r from-teal-500 to-blue-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 2, ease: 'easeOut' }}
        />
      </div>
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-4xl">
                {getDegreeEmoji(education.degree)}
              </span>
              <div>
                <h3 className="text-2xl font-bold text-white leading-tight">
                  {education.institution}
                </h3>
                {education.degree && (
                  <p className="text-sm text-gray-400">
                    {OptionToValue(DEGREE_OPTIONS, education.degree)}
                  </p>
                )}
              </div>
            </div>
            
            {hasDescription && (
              <button 
                onClick={handleToggleDetails}
                className="p-1.5 rounded-full hover:bg-gray-700/50 transition-colors text-gray-400 hover:text-white"
                aria-label={isExpandedState ? 'Show less' : 'Show more'}
              >
                {isExpandedState ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center gap-2 text-white">
              <BookOpen className="w-4 h-4 flex-shrink-0 text-teal-500" />
              <span>{education.fieldOfStudy}</span>
            </div>
            
            <div className="flex items-center gap-2 text-white">
              <Calendar className="w-4 h-4 flex-shrink-0 text-blue-400" />
              <span>{formatDateRange(education.startYear, education.endYear)}</span>
            </div>
            
            {education.location && (
              <div className="flex items-center gap-2 text-white">
                <MapPin className="w-4 h-4 flex-shrink-0 text-rose-400" />
                <span>{education.location}</span>
              </div>
            )}
            
            {education.grade && (
              <div className="flex items-center gap-2 text-white">
                <Star className="w-4 h-4 flex-shrink-0 text-yellow-400" />
                <span>
                  {education.gradeType || 'Grade'}: 
                  <span className="font-medium text-white ml-1">
                    {education.grade.trim().split(' ')[0]} {education.grade.trim().split(' ')[1] === 'Percentage' ? '%' : education.grade.trim().split(' ')[1]}
                  </span>
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Expandable description section */}
        <AnimatePresence>
          {isExpandedState && hasDescription && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="pt-2">
                <div className="text-gray-300 text-sm leading-relaxed bg-gray-800/30 p-4 rounded-lg border border-gray-700/50">
                  <div className="ml-6">
                    {htmlToElement(education.description || '')}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Footer with status and toggle button */}
      {hasDescription && (
        <div className="mt-4 pt-4 border-t border-gray-800 flex items-center justify-between">
          <span className="text-white text-xs flex items-center gap-2">
            <span className={`relative flex h-2 w-2`}>
              <span className={`absolute inline-flex h-full w-full rounded-full ${education.endYear && Number(education.endYear) >= Number(new Date().getFullYear()) ? 'bg-teal-400' : 'bg-blue-400'} opacity-100 animate-ping`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${education.endYear && Number(education.endYear) >= Number(new Date().getFullYear()) ? 'bg-teal-500' : 'bg-blue-500'}`}></span>
            </span>
            {(education.endYear && Number(education.endYear) >= Number(new Date().getFullYear())) ? 'In Progress' : 'Completed'}
          </span>
          <button 
            onClick={handleToggleDetails}
            className="text-xs font-medium text-teal-400 hover:text-teal-300 flex items-center gap-1"
          >
            {isExpandedState ? 'Show less' : 'Show details'}
            <ChevronDown 
              size={16} 
              className={`transition-transform duration-200 ${isExpandedState ? 'rotate-180' : ''}`} 
            />
          </button>
        </div>
      )}
    </motion.article>
  );
};

export default EducationCard;

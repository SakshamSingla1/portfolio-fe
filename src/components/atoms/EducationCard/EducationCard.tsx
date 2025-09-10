import React from 'react';
import { motion, Variants } from 'framer-motion';
import { FaGraduationCap, FaCalendarAlt, FaMapMarkerAlt, FaBook, FaExternalLinkAlt } from 'react-icons/fa';
import { Education } from '../../../services/useEducationService';

// Types
interface EducationCardProps {
  education: Education;
  onClick?: () => void;
  className?: string;
}

// Colors
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
  tap: { scale: 0.98 }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1]
    }
  }
};

const CARD_STYLES = {
  card: {
    base: {
      borderRadius: '16px',
      overflow: 'hidden',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.03)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: 'white',
      position: 'relative',
      '&:hover': {
        transform: 'translateY(-4px)'
      }
    },
    hover: {
      y: -8,
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 15
      }
    }
  },
  header: {
    padding: '1.75rem 1.5rem',
    color: 'white',
    background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryLight} 100%)`,
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
      pointerEvents: 'none'
    }
  },
  iconContainer: {
    width: '60px',
    height: '60px',
    borderRadius: '16px',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(4px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      transform: 'scale(1.05) rotate(5deg)',
      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)'
    }
  },
  content: {
    padding: '1.5rem',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  tag: {
    base: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.4rem 0.9rem',
      borderRadius: '8px',
      border: `1px solid ${COLORS.border}`,
      fontSize: '0.875rem',
      fontWeight: 500,
    },
    primary: {
      backgroundColor: `${COLORS.primary}08`,
    },
    accent: {
      backgroundColor: `${COLORS.accent}08`,
    },
    muted: {
      backgroundColor: `${COLORS.textSecondary}05`,
    },
    grade: {
      backgroundColor: COLORS.primaryLight,
      color: COLORS.primary,
      padding: '0.5rem 1rem',
      fontWeight: 600,
      border: `1px solid ${COLORS.primary}30`,
      boxShadow: `0 2px 4px ${COLORS.primary}10`,
    }
  },
  description: {
    backgroundColor: COLORS.background,
    padding: '1rem',
    borderRadius: '8px',
    border: `1px solid ${COLORS.border}`,
    marginTop: 'auto',
  },
  footer: {
    padding: '1rem 1.5rem',
    borderTop: `1px solid ${COLORS.border}`,
    backgroundColor: COLORS.background,
  },
  statusDot: (isCurrent: boolean) => ({
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    backgroundColor: isCurrent ? COLORS.accent : COLORS.success,
    boxShadow: `0 0 0 0 ${isCurrent ? COLORS.accent : COLORS.success}80`,
    animation: 'pulse 2s infinite',
    // Keyframes are now defined in a style tag in the component
  } as React.CSSProperties),
  gpaBadge: {
    padding: '0.4rem 1rem',
    backgroundColor: COLORS.primaryLight,
    color: COLORS.primary,
    borderRadius: '9999px',
    fontSize: '0.8125rem',
    fontWeight: 600,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: `0 4px 12px ${COLORS.primary}30`
    },
    '&::before': {
      content: '"🏆"',
      fontSize: '1rem',
      lineHeight: 1
    }
  }
} as const;

const EducationCard: React.FC<EducationCardProps> = ({
  education,
  onClick,
  className = '',
}) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const isCurrent = education.endYear ? new Date(education.endYear) > new Date() : false;
  
  // Format date range
  const formatDateRange = (start?: number, end?: number) => {
    if (!start) return '';
    const startYear = start;
    const endYear = end ? end : 'Present';
    return `${startYear} - ${endYear}`;
  };

  // Format grade display
  const formatGrade = (grade: string, type?: string) => {
    if (!grade) return '';
    return type === 'Percentage' ? `${grade}%` : type ? `${grade} ${type}` : grade;
  };

  const gradeType = education.grade?.trim().split(" ")[1] || '';
  const grade = education.grade?.trim().split(" ")[0] || '';

  const gradeDisplay = formatGrade(grade, gradeType);

  return (
    <>
      <style>{`
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 ${isCurrent ? COLORS.accent : COLORS.success}80; }
          70% { box-shadow: 0 0 0 10px ${isCurrent ? COLORS.accent : COLORS.success}00; }
          100% { box-shadow: 0 0 0 0 ${isCurrent ? COLORS.accent : COLORS.success}00; }
        }
      `}</style>
      
      <motion.div 
        className={`education-card ${className}`}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        whileTap="tap"
        variants={cardVariants}
        style={{ ...CARD_STYLES.card.base, cursor: onClick ? 'pointer' : 'default' } as React.CSSProperties}
        onClick={onClick}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        {isHovered && (
          <motion.div 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.accent})`,
              transformOrigin: 'left',
            }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
          />
        )}
        
        {/* Header */}
        <motion.div 
          style={CARD_STYLES.header}
          variants={itemVariants}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}>
            <div style={CARD_STYLES.iconContainer}>
              <FaGraduationCap size={28} color="white" />
            </div>
            
            <div style={{ flex: 1, minWidth: 0 }}>
              <h3 style={{
                margin: 0,
                color: 'white',
                fontSize: '1.375rem',
                fontWeight: 700,
                marginBottom: '0.25rem',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}>
                {education.degree}
              </h3>
              <p style={{
                margin: 0,
                color: 'rgba(255, 255, 255, 0.9)',
                fontWeight: 500,
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}>
                {education.institution}
                {onClick && <FaExternalLinkAlt size={12} style={{ opacity: 0.7 }} />}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Body */}
        <motion.div 
          style={CARD_STYLES.content}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
              }
            }
          }}
        >
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.75rem',
            marginBottom: '1.25rem',
          }}>
            {education.fieldOfStudy && (
              <motion.div 
                style={{ ...CARD_STYLES.tag.base, ...CARD_STYLES.tag.primary }}
                variants={itemVariants}
              >
                <FaBook size={14} color={COLORS.primary} style={{ opacity: 0.8 }} />
                <span>{education.fieldOfStudy}</span>
              </motion.div>
            )}
            
            {(education.startYear || education.endYear) && (
              <motion.div 
                style={{ ...CARD_STYLES.tag.base, ...CARD_STYLES.tag.accent }}
                variants={itemVariants}
              >
                <FaCalendarAlt size={14} color={COLORS.accent} style={{ opacity: 0.8 }} />
                <span>{formatDateRange(Number(education.startYear), Number(education.endYear))}</span>
              </motion.div>
            )}
            
            {education.location && (
              <motion.div 
                style={{ ...CARD_STYLES.tag.base, ...CARD_STYLES.tag.muted }}
                variants={itemVariants}
              >
                <FaMapMarkerAlt size={14} color={COLORS.textSecondary} style={{ opacity: 0.8 }} />
                <span>{education.location}</span>
              </motion.div>
            )}
          </div>

          {education.description && (
            <motion.div 
              style={CARD_STYLES.description}
              variants={itemVariants}
            >
              <p style={{
                margin: 0,
                color: COLORS.textSecondary,
                lineHeight: '1.7',
                fontSize: '0.9375rem',
              }}>
                {education.description}
              </p>
            </motion.div>
          )}
        </motion.div>
        
        {/* Footer */}
        <motion.div 
          style={CARD_STYLES.footer}
          variants={itemVariants}
        >
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={CARD_STYLES.statusDot(isCurrent)} />
              <span style={{
                fontSize: '0.8125rem',
                color: COLORS.textSecondary,
                fontWeight: 500,
              }}>
                {isCurrent ? 'In Progress' : 'Completed'}
              </span>
            </div>
            
            {education.grade && (
              <div style={CARD_STYLES.gpaBadge}>
                {gradeType === 'Percentage' ? 'Percentage: ' : gradeType === 'CGPA' ? 'CGPA: ' : 'Grade: '}{gradeDisplay }
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </>
  );
};

export default React.memo(EducationCard);

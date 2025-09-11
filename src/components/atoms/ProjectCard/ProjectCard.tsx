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
const getCardVariants = (): Variants => ({
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
      stiffness: 300,
      damping: 15
    }
  },
  tap: { 
    scale: 0.98,
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
  }
});

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
        padding: '1.25rem 1.5rem',
        borderTop: `1px solid ${COLORS.border}`,
        backgroundColor: COLORS.background,
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
    },
    statusBadge: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem 0.75rem',
        backgroundColor: 'rgba(16, 185, 129, 0.08)',
        borderRadius: '6px',
        border: '1px solid rgba(16, 185, 129, 0.2)',
        alignSelf: 'flex-start',
    },
    techHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        marginBottom: '0.75rem',
    },
    techGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
        gap: '0.75rem',
        width: '100%',
    },
    techItem: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.75rem',
        borderRadius: '8px',
        backgroundColor: 'rgba(0, 0, 0, 0.02)',
        border: '1px solid rgba(0, 0, 0, 0.05)',
        transition: 'all 0.2s ease',
        '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
            backgroundColor: 'rgba(26, 86, 219, 0.03)',
        }
    },
    techLogo: {
        width: '32px',
        height: '32px',
        objectFit: 'contain',
        borderRadius: '6px',
    },
    techName: {
        fontSize: '0.75rem',
        fontWeight: 500,
        color: COLORS.textSecondary,
        textAlign: 'center',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        width: '100%',
    },
    projectLink: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        color: COLORS.primary,
        textDecoration: 'none',
        fontSize: '0.875rem',
        fontWeight: 500,
        marginTop: '0.5rem',
        alignSelf: 'flex-start',
        padding: '0.5rem 0',
        '&:hover': {
            textDecoration: 'underline',
        }
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

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
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

  const cardVariants = useMemo(() => getCardVariants(), []);
  
  return (
    <motion.article
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      whileTap="tap"
      style={{
        ...CARD_STYLES.card.base,
        ':hover': {
          transform: 'translateY(-4px)'
        }
      } as React.CSSProperties}
    >
      {/* Header */}
      <header style={CARD_STYLES.header as React.CSSProperties}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={CARD_STYLES.iconContainer as React.CSSProperties}>
            {project.projectImageUrl && !imageError ? (
              <img
                src={project.projectImageUrl}
                alt={project.projectName}
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '16px',
                  transition: 'transform 0.3s ease',
                }}
                onError={() => setImageError(true)}
                loading="lazy"
              />
            ) : (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
                color: 'white',
                fontSize: '1.5rem'
              }}>
                <FaCode />
              </div>
            )}
          </div>
          
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{
              margin: 0,
              fontSize: '1.25rem',
              fontWeight: 600,
              color: 'white',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {project.projectName}
            </h3>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.5rem',
              marginTop: '0.5rem',
              fontSize: '0.875rem',
              color: 'rgba(255, 255, 255, 0.9)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FaCalendarAlt style={{ fontSize: '0.875rem' }} />
                <span>{formatDateRange(project.projectStartDate?.toString(), project.projectEndDate?.toString())}</span>
              </div>
              
              {isCurrent && (
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  backdropFilter: 'blur(4px)'
                }}>
                  <span style={{
                    ...CARD_STYLES.statusDot(true),
                    animation: 'none',
                    width: '8px',
                    height: '8px',
                    boxShadow: 'none'
                  }} />
                  Active
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Body */}
      <div style={{
        ...CARD_STYLES.content,
        gap: '1.25rem',
        padding: '1.5rem'
      }}>
        <div style={{
          color: COLORS.textSecondary,
          lineHeight: 1.6,
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          display: '-webkit-box',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {htmlToElement(project.projectDescription)}
        </div>
        
        {/* Project Links */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.75rem',
          marginTop: 'auto',
          paddingTop: '0.5rem'
        }}>
          {project.projectLink && (
            <a
              href={project.projectLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                ...CARD_STYLES.tag.base,
                ...CARD_STYLES.tag.muted,
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                backgroundColor: CARD_STYLES.tag.muted.backgroundColor,
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.03)',
                  transform: 'translateY(-1px)'
                }
              } as React.CSSProperties}
            >
              <FaGithub style={{ fontSize: '1rem' }} />
              <span>GitHub</span>
              <span style={{
                fontSize: '0.75rem',
                color: COLORS.textSecondary,
                opacity: 0.8
              }}>
                {getDomain(project.projectLink)}
              </span>
            </a>
          )}
          
          {project.projectLink && (
            <a
              href={project.projectLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                ...CARD_STYLES.tag.base,
                ...CARD_STYLES.tag.primary,
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                backgroundColor: CARD_STYLES.tag.primary.backgroundColor,
                '&:hover': {
                  backgroundColor: `${COLORS.primary}10`,
                  transform: 'translateY(-1px)'
                }
              } as React.CSSProperties}
            >
              <FaExternalLinkAlt style={{ fontSize: '0.875rem' }} />
              <span>Live Demo</span>
              <span style={{
                fontSize: '0.75rem',
                color: COLORS.primary,
                opacity: 0.8
              }}>
                {getDomain(project.projectLink)}
              </span>
            </a>
          )}
        </div>
      </div>

      {/* Tech Stack */}
      {project.technologiesUsed?.length > 0 && (
        <footer style={CARD_STYLES.footer as React.CSSProperties}>
          <div style={CARD_STYLES.techHeader as React.CSSProperties}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.textSecondary }}>TECH STACK</span>
          </div>
          <div style={CARD_STYLES.techGrid as React.CSSProperties}>
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
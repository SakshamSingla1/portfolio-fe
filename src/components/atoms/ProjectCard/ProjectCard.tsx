import React from 'react';
import { motion, Variants } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt, FaCalendarAlt, FaTags } from 'react-icons/fa';
import { ProjectResponse } from '../../../services/useProjectService';
import dayjs from 'dayjs';

interface ProjectCardProps {
    project: ProjectResponse;
}

const COLORS = {
    primary: '#4F46E5',
    primaryLight: '#EEF2FF',
    textPrimary: '#1F2937',
    textSecondary: '#4B5563',
    background: '#FFFFFF',
    backgroundSecondary: '#F9FAFB',
    success: '#10B981',
    successLight: '#D1FAE5',
    border: '#E5E7EB',
    accent: '#8B5CF6',
} as const;

const fadeIn: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: [0.4, 0, 0.2, 1] as const  // Add 'as const' to make it a readonly tuple
        }
    },
    hover: {
        y: -5,
        transition: {
            type: 'spring',
            stiffness: 300
        }
    }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const fadeInItem = {
    hidden: { opacity: 0, y: 10 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.3 }
    }
};

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
    const isCurrent = project.projectEndDate ? new Date(project.projectEndDate) > new Date() : false;

    const formatDate = (date?: Date | string) =>
        date ? dayjs(date).format('MMM D, YYYY') : 'Present';

    const formatDateRange = (start?: Date | string, end?: Date | string) =>
        start ? `${formatDate(start)} - ${end ? formatDate(end) : 'Present'}` : '';

    return (
        <motion.div
            className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            layout
        >
            {/* Image */}
            <motion.div className="relative aspect-video bg-gray-50 overflow-hidden">
                {project.projectImageUrl ? (
                    <motion.img
                        src={project.projectImageUrl}
                        alt={project.projectName}
                        className="w-full h-full object-cover"
                        initial={{ opacity: 0.9 }}
                        whileHover={{ scale: 1.03, filter: 'brightness(1.05)' }}
                        transition={{ duration: 0.3 }}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                        <FaExternalLinkAlt className="text-gray-400 text-2xl" />
                    </div>
                )}

                {isCurrent && (
                    <motion.div
                        className="absolute top-3 right-3 bg-green-50 text-green-800 px-2 py-1 rounded-full flex items-center gap-1 text-xs font-semibold"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                        Active
                    </motion.div>
                )}
            </motion.div>

            {/* Content */}
            <motion.div className="p-5" variants={staggerContainer} initial="hidden" animate="visible">
                {/* Header */}
                <motion.div className="flex justify-between items-start mb-3" variants={fadeInItem}>
                    <motion.h3
                        className="text-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
                        whileHover={{ backgroundPosition: '100% 0%' }}
                    >
                        {project.projectName}
                    </motion.h3>

                    <div className="flex gap-2">
                        {project.projectLink && (
                            <motion.a
                                href={project.projectLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <FaGithub size={16} />
                            </motion.a>
                        )}
                        {project.projectLink && (
                            <motion.a
                                href={project.projectLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <FaExternalLinkAlt size={14} />
                            </motion.a>
                        )}
                    </div>
                </motion.div>

                {/* Date */}
                {(project.projectStartDate || project.projectEndDate) && (
                    <motion.div className="flex items-center gap-2 text-sm text-gray-500 mb-4" variants={fadeInItem}>
                        <FaCalendarAlt className="text-gray-400" size={12} />
                        <span>{formatDateRange(project.projectStartDate, project.projectEndDate)}</span>
                    </motion.div>
                )}

                {/* Description */}
                <motion.p
                    className="text-gray-600 mb-5 leading-relaxed"
                    variants={fadeInItem}
                >
                    {project.projectDescription}
                </motion.p>

                {/* Technologies */}
                {project.technologiesUsed?.length > 0 && (
                    <motion.div
                        className="mt-5 pt-4 border-t border-dashed border-gray-200"
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.div
                            className="flex items-center text-xs text-gray-400 uppercase tracking-wider mb-3"
                            variants={fadeInItem}
                        >
                            <FaTags className="mr-2" size={12} />
                            <span>Tech Stack</span>
                        </motion.div>

                        <motion.div className="flex flex-wrap gap-2" variants={staggerContainer}>
                            {project.technologiesUsed.map((tech, index) => (
                                <motion.div
                                    key={index}
                                    className="bg-white border border-gray-200 text-sm text-gray-600 px-3 py-1.5 rounded-lg flex items-center gap-2"
                                    variants={fadeInItem}
                                    whileHover={{ y: -2, boxShadow: '0 4px 12px -2px rgba(99, 102, 241, 0.1)' }}
                                    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                                >
                                    {tech.logoUrl && (
                                        <div className="w-5 h-5 rounded bg-white flex items-center justify-center overflow-hidden">
                                            <img
                                                src={tech.logoUrl}
                                                alt={tech.logoName}
                                                className="w-4 h-4 object-contain"
                                            />
                                        </div>
                                    )}
                                    <span className="whitespace-nowrap overflow-hidden text-ellipsis max-w-[100px]">
                                        {tech.logoName}
                                    </span>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>
                )}
            </motion.div>
        </motion.div>
    );
};

export default React.memo(ProjectCard);

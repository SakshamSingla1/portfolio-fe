import React from 'react';
import { motion, Variants } from 'framer-motion';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaGithub, FaLinkedin, FaGlobe } from 'react-icons/fa';
import { ProfileRequest } from '../../../services/useProfileService';
import { COLORS } from '../../../utils/constant';

interface ProfileCardProps {
  profile: ProfileRequest;
  className?: string;
}

// Animation variants
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.1
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut'
    }
  }
};

const hoverVariants: Variants = {
  hover: {
    scale: 1.02,
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
  },
  tap: {
    scale: 0.99
  }
};

const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  className = '',
}) => {
  const {
    fullName,
    title,
    email,
    phone,
    location,
    githubUrl,
    linkedinUrl,
    websiteUrl,
    profileImageUrl,
  } = profile;
  

  return (
    <motion.div
      className={`relative bg-[var(--background)] rounded-2xl shadow-lg overflow-hidden ${className}`}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      whileTap="tap"
      style={{
        '--background': COLORS.background,
        '--accent-1': COLORS.accent_1,
        '--primary': COLORS.primary,
        '--accent-2': COLORS.accent_2,
      } as React.CSSProperties}
    >
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent-1)] rounded-full -mr-16 -mt-16 opacity-20" />
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-[var(--primary)] rounded-full -ml-20 -mb-20 opacity-20" />
      <div className="relative z-10 flex flex-col md:flex-row bg-[var(--background)]/90 backdrop-blur-sm">
        {/* Image Section - 16:9 Aspect Ratio */}
        <motion.div 
          className="w-full md:w-2/5 lg:w-1/3 relative overflow-hidden group"
          variants={itemVariants}
        >
          <div className="relative pb-[125%] md:pb-[140%] lg:pb-[120%] overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-[var(--accent-1)]/10"
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <motion.img
                src={profileImageUrl || '/default-profile.jpg'}
                alt={fullName}
                className="w-full h-full object-cover rounded-3xl transition-transform duration-700 group-hover:scale-105"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              />
            </motion.div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </motion.div>
        
        {/* Details Section */}
        <motion.div 
          className="p-8 flex-1"
          variants={itemVariants}
        >
          {/* Header */}
          <motion.div className="mb-8">
            <motion.h2 
              className="text-3xl font-extrabold bg-gradient-to-r from-[var(--accent-1)] to-[var(--accent-2)] bg-clip-text text-transparent"
              initial={{ backgroundPosition: '0% 50%' }}
              animate={{ backgroundPosition: '100% 50%' }}
              transition={{
                duration: 10,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'linear'
              }}
            >
              {fullName}
            </motion.h2>
            {title && (
              <motion.p 
                className="text-lg text-[var(--accent-2)] mt-2 font-medium"
                variants={itemVariants}
              >
                {title}
              </motion.p>
            )}
          </motion.div>

          {/* Contact Information */}
          <motion.div className="space-y-4 mb-8">
            {email && (
              <motion.div 
                className="group flex items-center"
                variants={itemVariants}
              >
                <div className="p-2 mr-3 rounded-lg bg-[var(--accent-1)] group-hover:bg-[var(--accent-2)] transition-colors duration-200">
                  <FaEnvelope className="text-[var(--background)] text-lg" />
                </div>
                <a 
                  href={`mailto:${email}`}
                  className="font-medium text-gray-700 hover:text-[var(--accent-2)] transition-colors duration-200 group-hover:translate-x-1 transform transition-transform"
                >
                  {email}
                </a>
              </motion.div>
            )}

            {phone && (
              <motion.div 
                className="group flex items-center"
                variants={itemVariants}
              >
                <div className="p-2 mr-3 rounded-lg bg-[var(--accent-1)] group-hover:bg-[var(--accent-2)] transition-colors duration-200">
                  <FaPhone className="text-[var(--background)] text-lg" />
                </div>
                <a 
                  href={`tel:${phone.replace(/\D/g, '')}`}
                  className="font-medium text-gray-700 hover:text-[var(--accent-2)] transition-colors duration-200 group-hover:translate-x-1 transform transition-transform"
                >
                  {phone}
                </a>
              </motion.div>
            )}

            {location && (
              <motion.div 
                className="group flex items-center"
                variants={itemVariants}
              >
                <div className="p-2 mr-3 rounded-lg bg-[var(--accent-1)] group-hover:bg-[var(--accent-2)] transition-colors duration-200">
                  <FaMapMarkerAlt className="text-[var(--background)] text-lg" />
                </div>
                <span className="text-gray-700 group-hover:text-[var(--accent-2)] transition-colors duration-200 group-hover:translate-x-1 transform transition-transform">
                  {location}
                </span>
              </motion.div>
            )}
          </motion.div>

          {/* Social Links */}
          {(githubUrl || linkedinUrl || websiteUrl) && (
            <motion.div 
              className="flex justify-start gap-6 mt-8 pt-6 border-t border-[var(--accent-1)]"
              variants={itemVariants}
            >
              {githubUrl && (
                <motion.a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-[var(--accent-1)]/20 text-[var(--accent-2)] hover:bg-[var(--accent-1)]/30 hover:text-[var(--primary)] transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
                  whileHover={{ scale: 1.1, backgroundColor: 'rgba(48, 227, 202, 0.3)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaGithub className="text-xl" />
                </motion.a>
              )}
              
              {linkedinUrl && (
                <motion.a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-[var(--accent-1)]/20 text-[var(--accent-2)] hover:bg-[var(--accent-1)]/30 hover:text-[var(--primary)] transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
                  whileHover={{ scale: 1.1, backgroundColor: 'rgba(48, 227, 202, 0.3)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaLinkedin className="text-xl" />
                </motion.a>
              )}
              
              {websiteUrl && (
                <motion.a
                  href={websiteUrl.startsWith('http') ? websiteUrl : `https://${websiteUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-[var(--accent-1)]/20 text-[var(--accent-2)] hover:bg-[var(--accent-1)]/30 hover:text-[var(--primary)] transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
                  whileHover={{ scale: 1.1, backgroundColor: 'rgba(48, 227, 202, 0.3)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaGlobe className="text-xl" />
                </motion.a>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
      
      {/* Animated border effect */}
      <motion.div 
        className="absolute inset-0 border-2 border-transparent rounded-2xl pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          borderColor: ['rgba(59, 130, 246, 0)', 'rgba(59, 130, 246, 0.5)', 'rgba(59, 130, 246, 0)'],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: 'loop',
          ease: 'easeInOut'
        }}
      />
    </motion.div>
  );
};

export default React.memo(ProfileCard);

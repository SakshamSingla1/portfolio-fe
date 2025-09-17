import React, { useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaGithub, FaLinkedin, FaGlobe, FaRocket } from 'react-icons/fa';
import { ProfileRequest } from '../../../services/useProfileService';
import { COLORS } from '../../../utils/constant';
import { FlipWords } from '../../ui/flip-words';
import SparklesText from '../../molecules/SparkleText/SparkesText';

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

// Hover variants are now defined inline where used

const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  className = '',
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
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

  const words = [
    {title}
  ]


  return (
    <motion.div
      className={`relative bg-gradient-to-br from-gray-900/95 via-gray-900/90 to-gray-900/95 rounded-3xl shadow-2xl overflow-hidden border-2 border-gray-800/50 transition-all duration-500 hover:shadow-blue-500/20 hover:border-blue-500/30 ${className}`}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      whileTap="tap"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      style={{
        '--background': COLORS.background,
        '--accent': COLORS.accent,
        '--primary': COLORS.primary,
      } as React.CSSProperties}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className={`absolute -top-32 -right-32 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl transition-all duration-1000 ${isHovered ? 'scale-150 opacity-30' : 'scale-100 opacity-20'}`}
          style={{
            animation: 'float 15s ease-in-out infinite',
          }}
        />
        <div 
          className={`absolute -bottom-32 -left-32 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl transition-all duration-1000 ${isHovered ? 'scale-150 opacity-30' : 'scale-100 opacity-20'}`}
          style={{
            animation: 'float 20s ease-in-out infinite',
            animationDelay: '2s'
          }}
        />
      </div>
      
      {/* Animated gradient border */}
      <div className={`absolute -inset-0.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 ${isHovered ? 'animate-gradient-xy' : ''}`} />
      
      <div className="relative z-10 flex flex-col md:flex-row bg-gradient-to-br from-gray-900/40 via-gray-900/30 to-gray-800/30 backdrop-blur-sm">
        {/* Image Section - 16:9 Aspect Ratio */}
        <motion.div 
          className="w-full md:w-2/5 lg:w-1/3 relative overflow-hidden group flex items-center justify-center p-6 md:p-8 lg:p-10"
          variants={itemVariants}
        >
          <div className="relative w-full max-w-xs overflow-hidden rounded-xl shadow-2xl border border-gray-700/50" style={{ aspectRatio: '3/4' }}>
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10"
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <motion.img
                src={profileImageUrl || '/default-profile.jpg'}
                alt={fullName}
                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
            
            {/* Decorative elements */}
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-xl" />
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-xl" />
          </div>
        </motion.div>
        
        {/* Details Section */}
        <motion.div 
          className="p-8 flex-1"
          variants={itemVariants}
        >
          {/* Header */}
          <motion.div className="mb-8">
            {/* Welcome badge */}
            <motion.div 
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 mb-4"
              variants={itemVariants}
            >
              <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
              <span className="text-gray-300 text-xs font-medium">
                Available for opportunities
              </span>
            </motion.div>

            {/* Name with gradient text */}
            <motion.h1 
              className="text-3xl sm:text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500"
              variants={itemVariants}
            >
              <div className="relative">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="text-white">I'm </span>
                  <div className="inline-block">
                    <SparklesText 
                      text={fullName}
                      colors={{ first: '#3b82f6', second: '#8b5cf6' }}
                      className="text-6xl font-extrabold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-[#3b82f6] to-[#8b5cf6]"
                    />
                  </div>
                </h1>
                <div className="absolute -z-10 top-1/2 -translate-y-1/2 left-1/4 w-24 sm:w-32 h-24 sm:h-32 bg-blue-500/20 rounded-full blur-2xl animate-pulse"></div>
              </div>
            </motion.h1>

            {/* Enhanced Animated title */}
            {title && (
              <motion.div 
                className="group relative inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-teal-500/10 border border-blue-500/20 mb-6 backdrop-blur-sm overflow-hidden"
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: '0 0 20px rgba(59, 130, 246, 0.2)'
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                {/* Animated background highlight on hover */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 1.5, ease: 'easeInOut' }}
                />
                
                {/* Animated icon */}
                <motion.div
                  animate={{
                    y: [0, -5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <FaRocket className="text-blue-400 text-base sm:text-lg" />
                </motion.div>
                
                {/* Text with enhanced styling */}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300 font-medium text-sm sm:text-base tracking-wide ">
                  <FlipWords 
                    words={[title]} 
                    className="font-semibold text-white"
                    duration={3000}
                  />
                </span>
                
                {/* Subtle glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
              </motion.div>
            )}
          </motion.div>

          {/* Contact Information */}
          <motion.div className="space-y-5 mb-8 px-2" variants={itemVariants}>
            {email && (
              <motion.div 
                className="group flex items-center"
                variants={itemVariants}
              >
                <div className="p-2.5 mr-3 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 group-hover:from-cyan-500 group-hover:to-blue-500 transition-all duration-300 shadow-lg shadow-blue-500/20 flex-shrink-0">
                  <FaEnvelope className="text-white text-sm" />
                </div>
                <a 
                  href={`mailto:${email}`}
                  className="font-medium text-gray-200 hover:text-white transition-colors duration-300 group-hover:translate-x-1 transform transition-transform text-sm sm:text-base flex-1 min-w-0 truncate"
                  title={email}
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
                <div className="p-2.5 mr-3 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 group-hover:from-emerald-500 group-hover:to-green-500 transition-all duration-300 shadow-lg shadow-green-500/20 flex-shrink-0">
                  <FaPhone className="text-white text-sm" />
                </div>
                <a 
                  href={`tel:${phone.replace(/\D/g, '')}`}
                  className="font-medium text-gray-200 hover:text-white transition-colors duration-300 group-hover:translate-x-1 transform transition-transform text-sm sm:text-base flex-1 min-w-0 truncate"
                  title={phone}
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
                <div className="p-2.5 mr-3 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-pink-500 group-hover:to-purple-500 transition-all duration-300 shadow-lg shadow-purple-500/20 flex-shrink-0">
                  <FaMapMarkerAlt className="text-white text-sm" />
                </div>
                <span className="text-gray-300 group-hover:text-white transition-colors duration-300 group-hover:translate-x-1 transform transition-transform text-sm sm:text-base flex-1 min-w-0 truncate" title={location}>
                  {location}
                </span>
              </motion.div>
            )}
          </motion.div>
          
          {/* Social Links */}
          {(githubUrl || linkedinUrl || websiteUrl) && (
            <motion.div 
              className="flex flex-wrap gap-4 mt-8 pt-6 border-t border-gray-800"
              variants={itemVariants}
            >
              {githubUrl && (
                <motion.a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-full bg-gradient-to-br from-gray-700/10 to-gray-800/10 text-gray-400 hover:text-white hover:from-gray-700/20 hover:to-gray-800/20 transition-all duration-300 hover:shadow-lg hover:shadow-gray-500/20 hover:-translate-y-0.5 border border-gray-700/20 hover:border-gray-600/30"
                  whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
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
                  className="p-2.5 rounded-full bg-gradient-to-br from-blue-600/10 to-blue-700/10 text-blue-400 hover:text-white hover:from-blue-600/20 hover:to-blue-700/20 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 hover:-translate-y-0.5 border border-blue-500/20 hover:border-blue-400/30"
                  whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
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
                  className="p-2.5 rounded-full bg-gradient-to-br from-cyan-500/10 to-teal-500/10 text-cyan-400 hover:text-white hover:from-cyan-500/20 hover:to-teal-500/20 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20 hover:-translate-y-0.5 border border-cyan-500/20 hover:border-cyan-400/30"
                  whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
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
        className="absolute inset-0 border-2 border-transparent rounded-3xl pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          borderColor: 'rgba(99, 102, 241, 0.3)',
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut'
        }}
      />
    </motion.div>
  );
};

// Keyframe animation is now handled by Tailwind's @keyframes

export default React.memo(ProfileCard);

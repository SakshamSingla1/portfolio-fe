import React from 'react';
import { motion, Variants } from 'framer-motion';
import { FaUser } from 'react-icons/fa';
import { COLORS } from '../../../utils/constant';
import { htmlToElement } from '../../../utils/helper';

interface AboutCardProps {
  aboutMe: string;
  profileImageUrl?: string;
}

const itemVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 15,
    filter: 'blur(2px)'
  },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.6,
      delay: i * 0.05,
      ease: [0.22, 1, 0.36, 1],
      filter: { duration: 0.3 }
    }
  })
};

const AboutCard: React.FC<AboutCardProps> = ({
  aboutMe,
  profileImageUrl,
}) => {
  return (
    <motion.div
      className="bg-[var(--background)] rounded-2xl shadow-lg overflow-hidden"
      variants={itemVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      style={{
        '--background': COLORS.background,
        '--accent-1': COLORS.accent_1,
        '--primary': COLORS.primary,
        '--accent-2': COLORS.accent_2,
      } as React.CSSProperties}
    >
      <div className="flex flex-col md:flex-row-reverse">
        {/* Image Section */}
        <div className="w-full md:w-2/5 lg:w-1/3 relative">
          <div className="relative pb-[100%] md:pb-[120%] overflow-hidden">
            {profileImageUrl ? (
              <motion.img
                src={profileImageUrl}
                alt="Profile"
                className="absolute inset-0 w-full h-full object-cover"
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  transition: { 
                    duration: 0.8, 
                    ease: [0.22, 1, 0.36, 1],
                    delay: 0.2
                  }
                }}
              />
            ) : (
              <div className="absolute inset-0 bg-[var(--accent-1)]/10 flex items-center justify-center">
                <FaUser className="text-[var(--accent-2)]/50 text-4xl" />
              </div>
            )}
          </div>
        </div>
        
        {/* About Text Section */}
        <div className="p-8 flex-1">
          <motion.h2 
            className="text-3xl font-bold bg-gradient-to-r from-[var(--accent-1)] to-[var(--accent-2)] bg-clip-text text-transparent text-[var(--accent-1)] mb-6"
            variants={itemVariants}
            custom={1}
          >
            About Me
          </motion.h2>
          
          <motion.div 
            className="prose max-w-none text-[var(--accent-2)]/80 text-lg"
            variants={itemVariants}
            custom={2}
          >
            {aboutMe && (
              <p className="mb-6 last:mb-0 leading-relaxed">
                {htmlToElement(aboutMe)}
              </p>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default React.memo(AboutCard);

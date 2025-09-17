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
      className="relative bg-gradient-to-br from-gray-900/95 via-gray-900/90 to-gray-900/95 rounded-3xl shadow-2xl overflow-hidden border-2 border-gray-800/50"
      variants={itemVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      style={{
        '--background': COLORS.background,
        '--accent': COLORS.accent,
        '--primary': COLORS.primary,
      } as React.CSSProperties}
    >
      <div className="relative z-10 flex flex-col md:flex-row-reverse bg-gradient-to-br from-gray-900/40 via-gray-900/30 to-gray-800/30 backdrop-blur-sm">
        {/* Image Section */}
        <motion.div
          className="w-full md:w-2/5 lg:w-1/3 p-6 md:p-8 lg:p-10"
          variants={itemVariants}
          custom={1}
        >
          <div className="sticky top-24">
            <div className="relative overflow-hidden rounded-2xl shadow-2xl border-2 border-gray-700/50">
              <div className="relative pb-[120%] overflow-hidden">
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
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center">
                    <FaUser className="text-white/50 text-6xl" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* About Text Section */}
        <motion.div
          className="p-8 md:p-10 lg:p-12 flex-1"
          variants={itemVariants}
          custom={2}
        >
          <div className="inline-flex items-center gap-3 mb-8 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
            <div className="w-2 h-2 rounded-full bg-blue-400"></div>
            <span className="text-blue-300 font-medium text-sm">Get to know me</span>
          </div>

          <motion.h2
            className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"
            variants={itemVariants}
            custom={3}
          >
            About Me
          </motion.h2>

          <motion.div
            className="prose prose-invert max-w-none text-gray-300 text-lg leading-relaxed space-y-4"
            variants={itemVariants}
            custom={4}
          >
            {aboutMe && (
              <div className="space-y-4">
                {aboutMe.split('\n').map((paragraph, i) => (
                  <motion.p
                    key={i}
                    className="mb-4 last:mb-0"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      transition: {
                        duration: 0.5,
                        delay: 0.1 * (i + 1)
                      }
                    }}
                  >
                    {htmlToElement(paragraph)}
                  </motion.p>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default React.memo(AboutCard);

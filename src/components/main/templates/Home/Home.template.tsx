import React from 'react';
import { motion } from 'framer-motion';
import { FormikProps } from 'formik';
import { ProfileRequest } from '../../../../services/useProfileService';

interface HomeTemplateProps {
  formik: FormikProps<ProfileRequest>;
}

const HomeTemplate: React.FC<HomeTemplateProps> = ({
  formik,
}) => {
  return (
    <section 
      id="home" 
      className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0B5345] to-[#073B32] text-white py-12 px-4 md:py-20 lg:py-24"
    >
      <div className="w-full max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <motion.h3 
          className="text-lg sm:text-xl md:text-2xl text-[#1ABC9C] mb-3 sm:mb-4"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          Hi, my name is
        </motion.h3>
        
        <motion.h1 
          id="user-detail-name" 
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-[#1ABC9C] to-[#17A589] bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {formik.values.fullName}
        </motion.h1>
        
        <motion.h2 
          className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold mb-6 sm:mb-8 text-[#17A589]"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {formik.values.title}
        </motion.h2>
        
        <motion.p 
          id="user-detail-intro" 
          className="text-base sm:text-lg md:text-xl text-[#17A589] mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          {formik.values.aboutMe}
        </motion.p>
        
        <motion.div 
          className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-8 sm:mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          {formik.values.githubUrl && (
            <motion.a
              href={formik.values.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-[#1ABC9C] hover:bg-[#17A589] transition-colors duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="GitHub"
            >
              <i className="fab fa-github text-lg sm:text-xl text-primary-100"></i>
            </motion.a>
          )}
          
          {formik.values.linkedinUrl && (
            <motion.a
              href={formik.values.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-[#1ABC9C] hover:bg-[#17A589] transition-colors duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="LinkedIn"
            >
              <i className="fab fa-linkedin-in text-lg sm:text-xl text-primary-100"></i>
            </motion.a>
          )}
          
          {formik.values.websiteUrl && (
            <motion.a
              href={formik.values.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-[#1ABC9C] hover:bg-[#17A589] transition-colors duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Website"
            >
              <i className="fas fa-globe text-lg sm:text-xl text-primary-100"></i>
            </motion.a>
          )}
        </motion.div>
        
        <motion.a
          href="#contact"
          className="inline-flex items-center px-6 py-3 sm:px-8 sm:py-4 bg-[#1ABC9C] hover:bg-[#17A589] text-white font-medium rounded-lg transition-colors duration-300 text-sm sm:text-base"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          Contact Me
          <svg 
            className="w-4 h-4 sm:w-5 sm:h-5 ml-2" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" 
            />
          </svg>
        </motion.a>
      </div>
    </section>
  );
};

export default HomeTemplate;

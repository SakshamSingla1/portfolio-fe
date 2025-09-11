import React, { ReactNode, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TooltipProps {
  children: React.ReactElement;
  content: ReactNode;
  delay?: number;
}

const Tooltip: React.FC<TooltipProps> = ({ children, content, delay = 300 }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
      >
        {children}
      </div>
      
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            transition={{
              type: 'spring',
              damping: 25,
              stiffness: 300,
              delay: delay / 1000
            }}
            className="absolute z-50 px-3 py-1.5 text-xs font-medium text-white bg-gray-800 rounded-md shadow-lg whitespace-nowrap"
            style={{
              left: '50%',
              bottom: 'calc(100% + 8px)',
              transform: 'translateX(-50%)',
              pointerEvents: 'none',
            }}
          >
            <div className="relative">
              {content}
              <div 
                className="absolute w-2 h-2 bg-gray-800 transform rotate-45 -bottom-1 left-1/2 -ml-1"
                style={{
                  boxShadow: '2px 2px 2px rgba(0,0,0,0.1)'
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tooltip;

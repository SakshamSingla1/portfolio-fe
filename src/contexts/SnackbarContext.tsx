import React, { useState, type ReactNode, type ReactElement, useMemo, useCallback } from 'react';
import { FiCheckCircle, FiXCircle, FiInfo, FiAlertTriangle } from 'react-icons/fi';
import { motion, AnimatePresence, type Variants } from 'framer-motion';

type SnackbarType = 'success' | 'error' | 'info' | 'warning';

interface SnackbarState {
  isActive: boolean;
  type: SnackbarType;
  message: string;
}

interface SnackbarContextProps {
  showSnackbar: (type: SnackbarType, message: string, duration?: number) => void;
  hideSnackbar: () => void;
  SnackBarComponent: ReactNode;
}

interface SnackbarProviderProps {
  children: ReactElement;
}

export const SnackbarContext = React.createContext<SnackbarContextProps | undefined>(undefined);

const snackbarVariants : Variants = {
  hidden: { 
    opacity: 0, 
    y: -20,
    x: 20,
    scale: 0.95 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    x: 0,
    scale: 1,
    transition: { 
      type: 'spring', 
      damping: 25, 
      stiffness: 300 
    }
  },
  exit: { 
    opacity: 0, 
    y: -20, 
    scale: 0.95,
    transition: { 
      duration: 0.2 
    } 
  }
};

export const SnackbarProvider: React.FC<SnackbarProviderProps> = ({ children }) => {
  const [snackBar, setSnackBar] = useState<SnackbarState>({
    isActive: false,
    type: 'success',
    message: '',
  });

  const showSnackbar = useCallback((type: SnackbarType, message: string, duration: number = 3000) => {
    setSnackBar({
      isActive: true,
      type,
      message,
    });

    const timer = setTimeout(() => {
      hideSnackbar();
    }, duration);

    return () => clearTimeout(timer);
  }, []);

  const hideSnackbar = useCallback(() => {
    setSnackBar(prev => ({ ...prev, isActive: false }));
  }, []);

  const getStyles = (type: SnackbarType) => {
    const baseStyles = {
      success: {
        background: '#25A74A',
        border: '#1C7D37',
        icon: <FiCheckCircle size={24} />,
      },
      error: {
        background: '#DA1E27',
        border: '#861318',
        icon: <FiXCircle size={24} />,
      },
      info: {
        background: '#1E88E5',
        border: '#1565C0',
        icon: <FiInfo size={24} />,
      },
      warning: {
        background: '#FFA000',
        border: '#FF8F00',
        icon: <FiAlertTriangle size={24} />,
      },
    };

    return baseStyles[type] || baseStyles.info;
  };

  const SnackBarComponent = useMemo(() => {
    return (
      <AnimatePresence>
        {snackBar.isActive && snackBar.message && (
          <motion.div
            className="fixed top-6 right-6 z-50 rounded-lg shadow-lg overflow-hidden"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={snackbarVariants}
          >
            <div
              className="flex items-center gap-3 px-4 py-3 min-w-[280px]"
              style={{
                backgroundColor: getStyles(snackBar.type).background,
                borderLeft: `4px solid ${getStyles(snackBar.type).border}`,
              }}
            >
              <div className="text-white">
                {getStyles(snackBar.type).icon}
              </div>
              <div className="text-white text-sm font-medium">
                {snackBar.message}
              </div>
              <button
                onClick={hideSnackbar}
                className="ml-auto text-white opacity-70 hover:opacity-100 transition-opacity"
                aria-label="Close"
              >
                <FiXCircle size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }, [snackBar, hideSnackbar]);

  const providerValue = useMemo(() => ({
    showSnackbar,
    hideSnackbar,
    SnackBarComponent,
  }), [showSnackbar, hideSnackbar, SnackBarComponent]);

  return (
    <SnackbarContext.Provider value={providerValue}>
      {children}
      {SnackBarComponent}
    </SnackbarContext.Provider>
  );
};

// Custom hook for easier usage
export const useSnackbar = () => {
  const context = React.useContext(SnackbarContext);
  if (context === undefined) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
};
import React, { useState, ReactNode, useCallback, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Info, AlertCircle, X } from 'react-feather';

type SnackbarType = 'success' | 'error' | 'info' | 'warning';

interface SnackbarState {
    id: string;
    type: SnackbarType;
    message: string;
    duration: number;
}

interface SnackbarContextProps {
    showSnackbar: (type: SnackbarType, message: string, duration?: number) => void;
    hideSnackbar: (id: string) => void;
}

export const SnackbarContext = React.createContext<SnackbarContextProps | undefined>(undefined);

const getIcon = (type: SnackbarType) => {
    const iconProps = { size: 20, className: 'mr-2' };
    switch (type) {
        case 'success': return <CheckCircle {...iconProps} />;
        case 'error': return <XCircle {...iconProps} />;
        case 'warning': return <AlertCircle {...iconProps} />;
        case 'info':
        default: return <Info {...iconProps} />;
    }
};

const getColors = (type: SnackbarType) => {
    const base = {
        success: { bg: 'bg-green-50', text: 'text-green-800', border: 'border-green-400' },
        error: { bg: 'bg-red-50', text: 'text-red-800', border: 'border-red-400' },
        warning: { bg: 'bg-yellow-50', text: 'text-yellow-800', border: 'border-yellow-400' },
        info: { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-400' },
    }[type];

    return {
        ...base,
        icon: `${base.text} opacity-80`,
    };
};

export const SnackbarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [snackbars, setSnackbars] = useState<SnackbarState[]>([]);

    const showSnackbar = useCallback((type: SnackbarType, message: string, duration = 1000) => {
        const id = Math.random().toString(36).substr(2, 9);
        setSnackbars(prev => [...prev, { id, type, message, duration }]);
    }, []);

    const hideSnackbar = useCallback((id: string) => {
        setSnackbars(prev => prev.filter(snackbar => snackbar.id !== id));
    }, []);

    // Auto-hide snackbars after their duration
    useEffect(() => {
        if (snackbars.length > 0) {
            const timer = setTimeout(() => {
                setSnackbars(prev => prev.slice(1));
            }, snackbars[0].duration);

            return () => clearTimeout(timer);
        }
    }, [snackbars]);

    const contextValue = useMemo(() => ({
        showSnackbar,
        hideSnackbar,
    }), [showSnackbar, hideSnackbar]);

    return (
        <SnackbarContext.Provider value={contextValue}>
            {children}
            <div className="fixed top-4 right-4 z-50 space-y-2 w-auto">
                <AnimatePresence>
                    {snackbars.map((snackbar) => {
                        const colors = getColors(snackbar.type);
                        return (
                            <motion.div
                                key={snackbar.id}
                                layout
                                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, x: '100%', transition: { duration: 0.2 } }}
                                className={`
                    relative flex items-start p-4 rounded-lg shadow-lg
                    ${colors.bg} ${colors.text} ${colors.border} border-l-4
                    transform transition-all duration-300 ease-in-out
                    hover:shadow-xl hover:-translate-y-0.5
                `}
                            >
                                <div className={`${colors.icon} flex-shrink-0`}>
                                    {getIcon(snackbar.type)}
                                </div>
                                <div className="flex-1 text-sm font-medium">
                                    {snackbar.message}
                                </div>
                                <button
                                    onClick={() => hideSnackbar(snackbar.id)}
                                    className="ml-2 p-1 -mt-1 -mr-1 rounded-full hover:bg-black/10 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent focus:ring-current"
                                    aria-label="Close"
                                >
                                    <X size={16} className="text-current" />
                                </button>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </SnackbarContext.Provider>
    );
};

export const useSnackbar = () => {
    const context = React.useContext(SnackbarContext);
    if (context === undefined) {
        throw new Error('useSnackbar must be used within a SnackbarProvider');
    }
    return context;
};
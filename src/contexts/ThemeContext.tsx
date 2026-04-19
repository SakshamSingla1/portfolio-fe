import React, { createContext, useContext, useState, useEffect } from 'react';

export interface ThemeContextType {
  isDark: boolean;
  isPreviewActive: boolean;
  activeThemeName: string;
  setColorMode: (mode: 'light' | 'dark') => void;
  resetTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  const [isPreviewActive, setIsPreviewActive] = useState(false);
  const [activeThemeName, setActiveThemeName] = useState('Default');

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const setColorMode = (mode: 'light' | 'dark') => {
    setIsDark(mode === 'dark');
  };

  const resetTheme = () => {
    setIsDark(false);
    setIsPreviewActive(false);
    setActiveThemeName('Default');
    localStorage.removeItem('customTheme');
  };

  const value: ThemeContextType = {
    isDark,
    isPreviewActive,
    activeThemeName,
    setColorMode,
    resetTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;

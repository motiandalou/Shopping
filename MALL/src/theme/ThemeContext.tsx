import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ConfigProvider, theme as antdTheme } from 'antd';

const { darkAlgorithm, defaultAlgorithm } = antdTheme;

// Define theme tokens
const lightTheme = {
  token: {
    colorPrimary: '#DB4444',
    colorSuccess: '#00FF66',
    colorWarning: '#FFAD33',
    colorError: '#DB4444',
    colorInfo: '#00A0E9',
    colorTextBase: '#000000',
    colorBgBase: '#FFFFFF',
    borderRadius: 4,
    fontSize: 16,
    fontFamily: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  algorithm: defaultAlgorithm,
};

const darkTheme = {
  token: {
    colorPrimary: '#DB4444',
    colorSuccess: '#00FF66',
    colorWarning: '#FFAD33',
    colorError: '#DB4444',
    colorInfo: '#00A0E9',
    borderRadius: 4,
    fontSize: 16,
    fontFamily: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  algorithm: darkAlgorithm,
};

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      <ConfigProvider theme={isDark ? darkTheme : lightTheme}>
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
};

import React, { createContext, useContext, ReactNode } from 'react';
import { useThemeMode } from '../hooks/useThemeMode';

interface ThemeContextType {
    mode: 'light' | 'dark';
    toggleMode: () => void;
    setThemeMode: (mode: 'light' | 'dark') => void;
    isLight: boolean;
    isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
    children: ReactNode;
}

/**
 * ThemeProvider - Provides theme state and controls to all child components
 * This ensures the theme state is properly shared across the app
 */
export const ThemeContextProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const themeMode = useThemeMode();

    return (
        <ThemeContext.Provider value={themeMode}>
            {children}
        </ThemeContext.Provider>
    );
};

/**
 * useThemeContext - Hook to access theme state and controls
 * Use this in components instead of useThemeMode directly
 */
export const useThemeContext = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useThemeContext must be used within a ThemeContextProvider');
    }
    return context;
};

export default ThemeContextProvider;

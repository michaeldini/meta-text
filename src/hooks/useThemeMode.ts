import { useState, useEffect } from 'react';

// Storage key for theme preference
const THEME_STORAGE_KEY = 'metatext-theme-mode';

// Save theme preference to localStorage
export const saveThemeMode = (mode: 'light' | 'dark') => {
    try {
        localStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch (error) {
        console.warn('Failed to save theme mode to localStorage:', error);
    }
};

// Load theme preference from localStorage
export const loadThemeMode = (): 'light' | 'dark' | null => {
    try {
        return localStorage.getItem(THEME_STORAGE_KEY) as 'light' | 'dark' | null;
    } catch (error) {
        console.warn('Failed to load theme mode from localStorage:', error);
        return null;
    }
};

// Get system theme preference
export const getSystemThemePreference = (): 'light' | 'dark' => {
    if (typeof window === 'undefined') return 'light';

    return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
};

// Hook for theme management with persistence and system preference detection
export const useThemeMode = () => {
    const [mode, setMode] = useState<'light' | 'dark'>(() => {
        // Priority: localStorage > system preference > default (light)
        const savedMode = loadThemeMode();
        if (savedMode) return savedMode;

        return getSystemThemePreference();
    });

    // Listen for system theme changes
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const handleSystemThemeChange = (e: MediaQueryListEvent) => {
            // Only auto-switch if user hasn't manually set a preference
            const savedMode = loadThemeMode();
            if (!savedMode) {
                setMode(e.matches ? 'dark' : 'light');
            }
        };

        mediaQuery.addEventListener('change', handleSystemThemeChange);
        return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
    }, []);

    const toggleMode = () => {
        const newMode = mode === 'light' ? 'dark' : 'light';
        setMode(newMode);
        saveThemeMode(newMode);
    };

    const setThemeMode = (newMode: 'light' | 'dark') => {
        setMode(newMode);
        saveThemeMode(newMode);
    };

    return {
        mode,
        toggleMode,
        setThemeMode,
        isLight: mode === 'light',
        isDark: mode === 'dark',
    };
};

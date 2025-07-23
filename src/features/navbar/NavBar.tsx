
/**
 * Navigation bar for the application.
 * - Basic navigation structure.
 * - Renders buttons for navigation links and actions from config (with icons and labels)
 * - Shows/hides items based on authentication
 * - Uses Material UI AppBar and Toolbar for layout
 * - Theme toggle button included
 */

import React from 'react';
import { AppBar, Box, Button, Toolbar, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { ThemeToggle } from 'components';
import { useThemeContext } from '../../contexts/ThemeContext';
import { createNavbarStyles } from './NavBar.styles';

import { getNavigationConfig } from './navigationConfig';

import { useAuth } from 'index';

/**
 * Main NavBar component
 * - Gathers navigation configuration, auth state, and theme.
 * - Maps over navItems config to render navigation buttons.
 */
const NavBar: React.FC = () => {

    const theme = useTheme();
    const styles = createNavbarStyles(theme);
    const { toggleMode } = useThemeContext();

    // Get authentication state and navigation functions
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const navConfig = getNavigationConfig(logout, navigate);

    // Filter items based on authentication
    const isAuthenticated = !!user;
    const navItems = navConfig.items.filter(item => {
        if (item.label === 'Login') return !isAuthenticated;
        if (item.label === 'Register') return !isAuthenticated;
        if (item.label === 'Logout') return isAuthenticated;
        return item.protected ? isAuthenticated : true;
    });

    return (
        <AppBar position="static" sx={styles.appBar} data-testid="navbar">
            <Toolbar>
                {/* Render each nav item as a Button with its action */}
                {navItems.map(item => (
                    <Button
                        key={item.label}
                        onClick={item.action}
                        disabled={item.disabled}
                        sx={styles.navButton}
                    >
                        {item.icon && <item.icon />}
                        {item.label && <span>{item.label}</span>}
                    </Button>
                ))}
                {/* Theme toggle button */}
                <Box sx={styles.themeToggleContainer}>
                    <ThemeToggle onToggle={toggleMode} />
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default NavBar;
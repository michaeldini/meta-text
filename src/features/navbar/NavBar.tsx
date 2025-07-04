import React from 'react';
import {
    AppBar,
    Toolbar,
    Box,
    useTheme,
} from '@mui/material';
import { useAuth } from 'store';
import { ThemeToggle } from 'components';
import { useThemeContext } from '../../contexts/ThemeContext';

import { useNavigation } from './hooks';
import { NavigationError } from './types';
import { createNavbarStyles } from './styles';
import NavBrandMenuSection from './components/NavBrandMenuSection';
import { getNavigationConfig } from './config/navigationConfig';

const NavBar: React.FC = () => {
    const theme = useTheme();
    const styles = createNavbarStyles(theme);

    const { user, logout } = useAuth();
    const { toggleMode } = useThemeContext();

    // Handle navigation errors
    const handleNavigationError = (error: NavigationError) => {
        console.error('Navigation error:', error);
    };

    // Get navigation config (NavBarProps model)
    const navConfig = getNavigationConfig(logout).config;

    const { navigationItems, isActive, handleItemClick } = useNavigation({
        user,
        onLogout: logout,
        config: navConfig,
        onError: handleNavigationError,
    });

    // Brand item from config
    const brandNavItem = navConfig.brand;

    const handleBrandClick = () => {
        if (brandNavItem?.path) {
            handleItemClick(brandNavItem);
        }
    };

    const handleMenuItemClick = (item: typeof navigationItems[0]) => {
        handleItemClick(item);
    };

    return (
        <AppBar
            position="static"
            sx={styles.appBar}
            data-testid="navbar"
        >
            <Toolbar sx={styles.toolbar}>
                {/* Brand and Navigation Menu Section */}
                <NavBrandMenuSection
                    styles={styles}
                    brandConfig={{ label: brandNavItem?.label || '', path: brandNavItem?.path }}
                    handleBrandClick={handleBrandClick}
                    navigationItems={navigationItems}
                    isActive={isActive}
                    handleMenuItemClick={handleMenuItemClick}
                />

                {/* Theme Toggle */}
                <Box sx={{ ml: 'auto' }}>
                    <ThemeToggle onToggle={toggleMode} data-testid="nav-theme-toggle" />
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default NavBar;

/**
 * NavBar component for application navigation.
 *
 * @param config - Navigation configuration object. Must include:
 *   - brand: { label: string; path: string }
 *   - items: Array<{ id: string; label: string; path?: string; action?: () => void; icon?: React.ReactNode; showWhen: 'authenticated' | 'unauthenticated' | 'always'; disabled?: boolean; badge?: string | number }>
 * @param data-testid - Optional test id for testing.
 */

import React from 'react';
import {
    AppBar,
    Toolbar,
    Button,
    Typography,
    Box,
    IconButton,
    useTheme,
} from '@mui/material';
import { MenuIcon } from 'icons';
import { useAuth } from 'store';
import { ThemeToggle } from 'components';
import { useThemeContext } from '../../contexts/ThemeContext';

import { useNavigation, useDropdownMenu } from './hooks';
import { NavBarProps, NavigationError } from './types';
import { DEFAULT_NAVBAR_CONFIG } from './index';
import { createNavbarStyles } from './styles';
import NavMenu from './components/NavMenu';
import NavBrandMenuSection from './components/NavBrandMenuSection';

const NavBar: React.FC<NavBarProps> = ({ config }) => {
    const theme = useTheme();
    const styles = createNavbarStyles(theme);

    const { user, logout } = useAuth();
    const { anchorEl, isOpen, openMenu, closeMenu, handleKeyDown } = useDropdownMenu();
    const { toggleMode } = useThemeContext();

    // Handle navigation errors
    const handleNavigationError = (error: NavigationError) => {
        console.error('Navigation error:', error);
        // In production, you might want to show a toast notification or log to monitoring service
    };

    // Convert readonly array to mutable array for type compatibility
    // config.items: NavigationItem[]
    const customItems = [...config.items];

    const { navigationItems, isActive, handleItemClick } = useNavigation({
        user,
        onLogout: logout,
        customItems,
        onError: handleNavigationError,
    });

    // Brand configuration (should match NavigationConfig.brand)
    const brandConfig = {
        label: config.brand.label || DEFAULT_NAVBAR_CONFIG.brand.label,
        path: config.brand.path || DEFAULT_NAVBAR_CONFIG.brand.path,
    };

    const handleBrandClick = () => {
        if (brandConfig.path) {
            handleItemClick({
                id: 'brand',
                label: brandConfig.label,
                path: brandConfig.path,
                showWhen: 'always'
            });
        }
    };

    const handleMenuItemClick = (item: typeof navigationItems[0]) => {
        handleItemClick(item, closeMenu);
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
                    brandConfig={brandConfig}
                    handleBrandClick={handleBrandClick}
                    openMenu={openMenu}
                    handleKeyDown={handleKeyDown}
                    isOpen={isOpen}
                    anchorEl={anchorEl}
                    closeMenu={closeMenu}
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

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
import { createNavbarStyles } from './NavBar.styles';
import NavBrandMenuSection from './components/NavBrandMenuSection';
import { getNavigationConfig } from './navigationConfig';

const NavBar: React.FC = () => {
    const theme = useTheme();
    const styles = createNavbarStyles(theme);

    const { user, logout } = useAuth();
    const { toggleMode } = useThemeContext();

    // Get navigation config (NavBarProps model)
    const navConfig = getNavigationConfig(logout).config;

    const { navigationItems, isActive, handleItemClick } = useNavigation({
        user,
        onLogout: logout,
        config: navConfig,
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
                <NavBrandMenuSection styles={styles} />
                <ThemeToggle onToggle={toggleMode} data-testid="nav-theme-toggle" />
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

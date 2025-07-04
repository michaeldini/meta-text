import React from 'react';
import {
    AppBar,
    Toolbar,
    Button,
    Typography,
    Box,
    Menu,
    MenuItem,
    Badge,
    useTheme,
    IconButton,
} from '@mui/material';
import { MenuIcon } from 'icons';
import { useAuth } from 'store';
import { ThemeToggle } from 'components';
import { useThemeContext } from '../../contexts/ThemeContext';

import { useNavigation, useDropdownMenu } from './hooks';
import { NavBarProps, NavigationError } from './types';
import type { NavigationConfig } from './types';
import { DEFAULT_NAVBAR_CONFIG } from './index';
import { createNavbarStyles } from './styles';

const NavBar: React.FC<NavBarProps> = ({
    config,
    'data-testid': dataTestId = 'navbar',
}) => {
    const theme = useTheme();
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
    const customItems = config?.items ? [...config.items] : undefined;

    const { navigationItems, isActive, handleItemClick } = useNavigation({
        user,
        onLogout: logout,
        customItems,
        onError: handleNavigationError,
    });

    // Brand configuration (should match NavigationConfig.brand)
    const brandConfig = {
        label: config?.brand?.label || DEFAULT_NAVBAR_CONFIG.brand.label,
        path: config?.brand?.path || DEFAULT_NAVBAR_CONFIG.brand.path,
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

    // Theme-aware styles (no need for useMemo)
    const styles = createNavbarStyles(theme);

    // Custom icons (Heroicons) need explicit styling since they don't inherit from MuiSvgIcon
    const menuIcon = <MenuIcon />;

    return (
        <AppBar
            position="static"
            elevation={2}
            sx={styles.appBar}
            data-testid={dataTestId}
        >
            <Toolbar sx={styles.toolbar}>
                {/* Brand and Navigation Menu Section */}
                <Box sx={styles.section}>
                    {/* Brand/Logo Button - Takes user to homepage */}
                    <Button
                        sx={styles.brandButton}
                        onClick={brandConfig.path ? handleBrandClick : undefined}
                        aria-label={`Go to homepage - ${brandConfig.label}`}
                        data-testid="nav-brand-button"
                    >
                        <Typography
                            component="span"
                            variant="h6"
                            data-testid="nav-brand"
                        >
                            {brandConfig.label}
                        </Typography>
                    </Button>

                    {/* Menu Trigger Icon - Opens dropdown */}
                    <IconButton
                        sx={styles.menuButton}
                        onClick={openMenu}
                        onKeyDown={handleKeyDown}
                        aria-label="Open navigation menu"
                        aria-controls={isOpen ? 'navigation-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={isOpen ? 'true' : 'false'}
                        data-testid="nav-menu-button"
                        size="medium"
                    >
                        {menuIcon}
                    </IconButton>

                    <Menu
                        id="navigation-menu"
                        anchorEl={anchorEl}
                        open={isOpen}
                        onClose={closeMenu}
                        onKeyDown={handleKeyDown}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                        sx={styles.dropdownMenu}
                        data-testid="nav-menu"
                        slotProps={{
                            list: {
                                'aria-label': 'Navigation items',
                                role: 'menu',
                            },
                        }}

                    >
                        {navigationItems.map((item) => (
                            <MenuItem
                                key={item.id}
                                onClick={() => handleMenuItemClick(item)}
                                selected={isActive(item.path)}
                                disabled={item.disabled}
                                sx={styles.menuItem}
                                data-testid={`nav-item-${item.id}`}
                                role="menuitem"
                                aria-label={`${item.label}${item.disabled ? ' (disabled)' : ''}`}
                            >
                                {item.icon && (
                                    <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
                                        {item.icon}
                                    </Box>
                                )}
                                {item.badge ? (
                                    <Badge
                                        badgeContent={item.badge}
                                        color="secondary"
                                    >
                                        <Typography variant="body2">{item.label}</Typography>
                                    </Badge>
                                ) : (
                                    <Typography variant="body2">{item.label}</Typography>
                                )}
                            </MenuItem>
                        ))}
                    </Menu>
                </Box>

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

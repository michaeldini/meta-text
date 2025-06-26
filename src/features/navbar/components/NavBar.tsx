import React, { useMemo } from 'react';
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
import { MenuIcon } from '../../../components/icons';
import { useAuth } from '../../../store/authStore';
import { useNavigation } from '../hooks/useNavigation';
import { useDropdownMenu } from '../hooks/useDropdownMenu';
import { NavBarProps, NavigationError } from '../types';
import { DEFAULT_NAVBAR_CONFIG } from '../index';
import ThemeToggle from '../../../components/ThemeToggle';
import { useThemeContext } from '../../../contexts/ThemeContext';
import { createNavbarStyles } from '../styles';

/**
 * NavBar Component - Simplified and maintainable
 * 
 * Features:
 * - Theme-aware responsive design
 * - Authentication-aware navigation
 * - Light/dark theme support
 * - Keyboard navigation
 */
const NavBar: React.FC<NavBarProps> = ({
    config = DEFAULT_NAVBAR_CONFIG,
    renderToolbar,
    className,
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
    const customItems = useMemo(() => {
        return config?.items ? [...config.items] : undefined;
    }, [config?.items]);

    const { navigationItems, isActive, handleItemClick } = useNavigation({
        user,
        onLogout: logout,
        customItems,
        onError: handleNavigationError,
    });

    // Memoize brand configuration
    const brandConfig = useMemo(() => ({
        label: config?.brand?.label || DEFAULT_NAVBAR_CONFIG.brand.label,
        path: config?.brand?.path || DEFAULT_NAVBAR_CONFIG.brand.path,
    }), [config?.brand]);

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

    // ✅ Simplified theme-aware styles
    const styles = useMemo(() => createNavbarStyles(theme), [theme]);

    // Custom icons (Heroicons) need explicit styling since they don't inherit from MuiSvgIcon
    const menuIcon = <MenuIcon />;

    return (
        <AppBar
            position="static"
            elevation={2}
            sx={styles.appBar}
            className={className}
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

                {/* Custom Toolbar Section */}
                {renderToolbar && (
                    <Box sx={styles.section} data-testid="nav-toolbar">
                        {renderToolbar()}
                    </Box>
                )}

                {/* Theme Toggle */}
                <Box sx={{ ml: 'auto' }}>
                    <ThemeToggle onToggle={toggleMode} data-testid="nav-theme-toggle" />
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default NavBar;

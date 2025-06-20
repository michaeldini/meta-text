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
} from '@mui/material';
import { KeyboardArrowDown } from '@mui/icons-material';
import { useAuth } from '../../../store/authStore';
import { useNavigation } from '../hooks/useNavigation';
import { useDropdownMenu } from '../hooks/useDropdownMenu';
import { NavBarProps, NavigationError } from '../types';
import { DEFAULT_NAVBAR_CONFIG } from '../index';
import {
    appBarStyles,
    toolbarStyles,
    brandTitleStyles,
    menuTriggerButtonStyles,
    dropdownMenuStyles,
    menuItemStyles,
    toolbarSectionStyles,
    menuItemIconStyles,
    menuItemBadgeStyles,
} from '../styles/styles';

/**
 * NavBar Component - Main navigation bar with dropdown menu
 * 
 * Features:
 * - Responsive design with Material-UI
 * - Authentication-aware navigation items
 * - Customizable brand and navigation items
 * - Keyboard navigation support
 * - Error handling for navigation failures
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

    // Memoize styles to prevent unnecessary recalculations
    const memoizedStyles = useMemo(() => ({
        appBar: appBarStyles(theme),
        toolbar: toolbarStyles(theme),
        brandTitle: brandTitleStyles(theme),
        menuButton: menuTriggerButtonStyles(theme),
        dropdownMenu: dropdownMenuStyles(theme),
        menuItem: menuItemStyles(theme),
        toolbarSection: toolbarSectionStyles(theme),
        menuItemIcon: menuItemIconStyles(theme),
        menuItemBadge: menuItemBadgeStyles(theme),
    }), [theme]);

    return (
        <AppBar
            position="fixed"
            elevation={2}
            sx={memoizedStyles.appBar}
            className={className}
            data-testid={dataTestId}
        >
            <Toolbar sx={memoizedStyles.toolbar}>
                {/* Brand and Navigation Menu Section */}
                <Box sx={memoizedStyles.toolbarSection}>
                    <Button
                        sx={memoizedStyles.menuButton}
                        onClick={openMenu}
                        onKeyDown={handleKeyDown}
                        aria-label={`Open navigation menu. Current brand: ${brandConfig.label}`}
                        aria-controls={isOpen ? 'navigation-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={isOpen ? 'true' : 'false'}
                        data-testid="nav-menu-button"
                        endIcon={<KeyboardArrowDown />}
                    >
                        <Typography
                            component="span"
                            sx={memoizedStyles.brandTitle}
                            onClick={brandConfig.path ? handleBrandClick : undefined}
                            data-testid="nav-brand"
                        >
                            {brandConfig.label}
                        </Typography>
                    </Button>

                    <Menu
                        id="navigation-menu"
                        anchorEl={anchorEl}
                        open={isOpen}
                        onClose={closeMenu}
                        onKeyDown={handleKeyDown}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                        sx={memoizedStyles.dropdownMenu}
                        data-testid="nav-menu"
                        MenuListProps={{
                            'aria-label': 'Navigation menu',
                            role: 'menu',
                        }}
                    >
                        {navigationItems.map((item) => (
                            <MenuItem
                                key={item.id}
                                onClick={() => handleMenuItemClick(item)}
                                selected={isActive(item.path)}
                                disabled={item.disabled}
                                sx={memoizedStyles.menuItem}
                                data-testid={`nav-item-${item.id}`}
                                role="menuitem"
                                aria-label={`${item.label}${item.disabled ? ' (disabled)' : ''}`}
                            >
                                {item.icon && (
                                    <Box sx={memoizedStyles.menuItemIcon}>
                                        {item.icon}
                                    </Box>
                                )}
                                {item.badge ? (
                                    <Badge
                                        badgeContent={item.badge}
                                        color="secondary"
                                        sx={memoizedStyles.menuItemBadge}
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
                    <Box sx={memoizedStyles.toolbarSection} data-testid="nav-toolbar">
                        {renderToolbar()}
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default NavBar;

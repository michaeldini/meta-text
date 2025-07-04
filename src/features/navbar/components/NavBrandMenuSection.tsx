import React, { useState, useCallback } from 'react';
import { Box, Button, Typography, IconButton } from '@mui/material';
import { MenuIcon } from 'icons';
import NavMenu from './NavMenu';
import { useAuth } from 'store';
import { useNavigation } from '../hooks';
import { getNavigationConfig } from '../navigationConfig';

interface NavBrandMenuSectionProps {
    styles: any;
}

const NavBrandMenuSection: React.FC<NavBrandMenuSectionProps> = ({ styles }) => {
    // Get user and logout from auth context
    const { user, logout } = useAuth();
    // Get navigation config
    const navConfig = getNavigationConfig(logout).config;
    // Use navigation hook
    const { navigationItems, isActive, handleItemClick } = useNavigation({
        user,
        onLogout: logout,
        config: navConfig,
    });
    // Brand item from config
    const brandNavItem = navConfig.brand;

    // Internalize menu state
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const isOpen = Boolean(anchorEl);

    const openMenu = useCallback((event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    }, []);

    const closeMenu = useCallback(() => {
        setAnchorEl(null);
    }, []);

    const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLElement>) => {
        if (event.key === 'Escape') {
            closeMenu();
        }
    }, [closeMenu]);

    const handleBrandClick = () => {
        if (brandNavItem?.path) {
            handleItemClick(brandNavItem);
        }
    };

    const handleMenuItemClick = (item: typeof navigationItems[0]) => {
        handleItemClick(item);
    };

    return (
        <Box sx={styles.section}>
            {/* Brand/Logo Button - Takes user to homepage */}
            <Button
                sx={styles.brandButton}
                onClick={brandNavItem?.path ? handleBrandClick : undefined}
                aria-label={`Go to homepage - ${brandNavItem?.label}`}
                data-testid="nav-brand-button"
            >
                <Typography
                    component="span"
                    variant="h6"
                    data-testid="nav-brand"
                >
                    {brandNavItem?.label}
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
                <MenuIcon />
            </IconButton>

            <NavMenu
                anchorEl={anchorEl}
                isOpen={isOpen}
                closeMenu={closeMenu}
                handleKeyDown={handleKeyDown}
                navigationItems={navigationItems}
                isActive={isActive}
                handleMenuItemClick={handleMenuItemClick}
                styles={styles}
            />
        </Box>
    );
};

export default NavBrandMenuSection;

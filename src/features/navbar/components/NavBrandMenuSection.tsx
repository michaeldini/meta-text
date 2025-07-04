import React from 'react';
import { Box, Button, Typography, IconButton } from '@mui/material';
import { MenuIcon } from 'icons';
import NavMenu from './NavMenu';
import { NavigationItem } from '../types';

interface NavBrandMenuSectionProps {
    styles: any;
    brandConfig: { label: string; path?: string };
    handleBrandClick: () => void;
    openMenu: (event: React.MouseEvent<HTMLElement>) => void;
    handleKeyDown: (event: React.KeyboardEvent<HTMLElement>) => void;
    isOpen: boolean;
    anchorEl: HTMLElement | null;
    closeMenu: () => void;
    navigationItems: NavigationItem[];
    isActive: (path?: string) => boolean;
    handleMenuItemClick: (item: NavigationItem) => void;
}

const NavBrandMenuSection: React.FC<NavBrandMenuSectionProps> = ({
    styles,
    brandConfig,
    handleBrandClick,
    openMenu,
    handleKeyDown,
    isOpen,
    anchorEl,
    closeMenu,
    navigationItems,
    isActive,
    handleMenuItemClick,
}) => (
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

export default NavBrandMenuSection;

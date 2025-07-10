// Navigation menu component for the navigation bar
// Provides a dropdown menu with navigation items, handling active states and click events.

import React from 'react';
import { Menu, MenuItem, Box, Typography, ListItemIcon, ListItemText, MenuList } from '@mui/material';
import { NavigationItem } from '../types';
import { MenuIcon } from 'icons';
import { SxProps } from '@mui/system';

interface NavMenuProps {
    navigationItems: NavigationItem[];
    isActive: (path?: string) => boolean;
    handleMenuItemClick: (item: NavigationItem) => void;
}

const NavMenu: React.FC<NavMenuProps> = ({
    navigationItems,
    isActive,
    handleMenuItemClick,
}) => {
    const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
    const isOpen = Boolean(anchorEl);

    const openMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const closeMenu = () => {
        setAnchorEl(null);
    };

    const renderMenuItem = (item: NavigationItem) => (
        <MenuItem
            key={item.id}
            onClick={() => {
                handleMenuItemClick(item);
                closeMenu();
            }}
            selected={isActive(item.path)}
            disabled={item.disabled}
            data-testid={`nav-item-${item.id}`}
            role="menuitem"
            aria-label={`${item.label}${item.disabled ? ' (disabled)' : ''}`}
        >
            <ListItemIcon>
                <Box component={item.icon as React.ComponentType} />
            </ListItemIcon>
            <ListItemText primary={item.label} />
        </MenuItem>
    );

    return (
        <>
            <Box sx={{ padding: 0 }}>
                <MenuItem
                    onClick={openMenu}
                    aria-label="Open navigation menu"
                    aria-controls={isOpen ? 'navigation-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={isOpen ? 'true' : 'false'}
                    data-testid="nav-menu-button"
                >
                    <MenuIcon />
                </MenuItem>
            </Box>
            <Menu
                id="navigation-menu"
                anchorEl={anchorEl}
                open={isOpen}
                onClose={closeMenu}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                data-testid="nav-menu"
            >
                <MenuList aria-label="Navigation items" role="menu">
                    {navigationItems.map(renderMenuItem)}
                </MenuList>
            </Menu>
        </>
    );
};

export default NavMenu;

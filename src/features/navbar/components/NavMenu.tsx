import React from 'react';
import { Menu, MenuItem, Box, Badge, Typography } from '@mui/material';
import { NavigationItem } from '../types';
import { MenuIcon, LoginIcon, LogoutIcon } from 'icons';
import type { IconProps } from 'icons';
interface NavMenuProps {
    navigationItems: NavigationItem[];
    isActive: (path?: string) => boolean;
    handleMenuItemClick: (item: NavigationItem) => void;
    styles: any;
}

const NavMenu: React.FC<NavMenuProps> = ({
    navigationItems,
    isActive,
    handleMenuItemClick,
    styles,
}) => {
    const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
    const isOpen = Boolean(anchorEl);

    const openMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const closeMenu = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <Box>
                <MenuItem
                    onClick={openMenu}
                    sx={styles.menuButton}
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
                        onClick={() => {
                            handleMenuItemClick(item);
                            closeMenu();
                        }}
                        selected={isActive(item.path)}
                        disabled={item.disabled}
                        sx={styles.menuItem}
                        data-testid={`nav-item-${item.id}`}
                        role="menuitem"
                        aria-label={`${item.label}${item.disabled ? ' (disabled)' : ''}`}
                    >
                        <Box component={item.icon as React.ComponentType} />
                        <Typography variant="body2">{item.label}</Typography>
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
};

export default NavMenu;

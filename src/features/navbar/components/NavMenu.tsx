import React from 'react';
import { Menu, MenuItem, Box, Badge, Typography } from '@mui/material';
import { NavigationItem } from '../types';

interface NavMenuProps {
    anchorEl: HTMLElement | null;
    isOpen: boolean;
    closeMenu: () => void;
    handleKeyDown: (event: React.KeyboardEvent<HTMLElement>) => void;
    navigationItems: NavigationItem[];
    isActive: (path?: string) => boolean;
    handleMenuItemClick: (item: NavigationItem) => void;
    styles: any;
}

const NavMenu: React.FC<NavMenuProps> = ({
    anchorEl,
    isOpen,
    closeMenu,
    handleKeyDown,
    navigationItems,
    isActive,
    handleMenuItemClick,
    styles,
}) => (
    <Menu
        id="navigation-menu"
        anchorEl={anchorEl}
        open={isOpen}
        onClose={closeMenu}
        onKeyDown={handleKeyDown as any}
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
                    <Badge badgeContent={item.badge} color="secondary">
                        <Typography variant="body2">{item.label}</Typography>
                    </Badge>
                ) : (
                    <Typography variant="body2">{item.label}</Typography>
                )}
            </MenuItem>
        ))}
    </Menu>
);

export default NavMenu;

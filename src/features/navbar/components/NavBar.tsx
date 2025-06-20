import React, { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useAuth } from '../../../store/authStore';
import { navBarAppBar, navBarToolbar, navBarTitle, menuButtonStyles } from '../styles/styles';
import ChunkToolsNavbar from '../../chunks/tools/ChunkToolsNavbar';

// Constants for routes and configuration
const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
} as const;

// Menu item configuration
interface MenuItemConfig {
    label: string;
    path?: string;
    action?: () => void;
    showWhen: 'authenticated' | 'unauthenticated' | 'always';
}

const createMenuItems = (
    handleMenuClick: (path: string) => void,
    handleLogout: () => void,
    isActive: (path: string) => boolean
): MenuItemConfig[] => [
        {
            label: 'Home',
            path: ROUTES.HOME,
            showWhen: 'authenticated',
        },
        {
            label: 'Login',
            path: ROUTES.LOGIN,
            showWhen: 'unauthenticated',
        },
        {
            label: 'Register',
            path: ROUTES.REGISTER,
            showWhen: 'unauthenticated',
        },
        {
            label: 'Logout',
            action: handleLogout,
            showWhen: 'authenticated',
        },
    ];

const NavBar: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    // Simplified isActive function
    const isActive = (path: string) =>
        location.pathname === path || location.pathname.startsWith(path);

    // Menu state
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    // Menu actions
    const handleMenuClick = (path: string) => {
        navigate(path);
        handleMenuClose();
    };

    const handleLogout = () => {
        logout();
        handleMenuClose();
    };

    // Filter menu items based on authentication state
    const menuItems = useMemo(() =>
        createMenuItems(handleMenuClick, handleLogout, isActive)
            .filter(item => {
                switch (item.showWhen) {
                    case 'authenticated':
                        return !!user;
                    case 'unauthenticated':
                        return !user;
                    case 'always':
                        return true;
                    default:
                        return false;
                }
            }),
        [user, handleMenuClick, handleLogout, isActive]
    );

    return (
        <AppBar position="fixed" elevation={2} sx={navBarAppBar}>
            <Toolbar sx={navBarToolbar}>
                <Box>
                    <Button
                        sx={menuButtonStyles}
                        onClick={handleMenuOpen}
                        aria-label="Open navigation menu"
                        aria-controls={open ? 'navigation-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                    >
                        <Typography variant="h6" sx={navBarTitle}>
                            Meta-Text
                        </Typography>
                    </Button>
                    <Menu
                        id="navigation-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleMenuClose}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                    >
                        {menuItems.map((item) => (
                            <MenuItem
                                key={item.label}
                                onClick={item.path ? () => handleMenuClick(item.path!) : item.action}
                                selected={item.path ? isActive(item.path) : false}
                            >
                                {item.label}
                            </MenuItem>
                        ))}
                    </Menu>
                </Box>
                <Box sx={{ flexGrow: 8 }} />
                <ChunkToolsNavbar />
            </Toolbar>
        </AppBar>
    );
};

export default NavBar;

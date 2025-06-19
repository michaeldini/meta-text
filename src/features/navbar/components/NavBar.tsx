import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useAuth } from '../../../store/authStore';
import { navBarAppBar, navBarToolbar, navBarTitle } from '../styles/styles';
import ChunkToolsNavbar from '../../chunks/tools/ChunkToolsNavbar';

const NavBar: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path);

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

    return (
        <AppBar position="fixed" elevation={2} sx={navBarAppBar}>
            <Toolbar sx={navBarToolbar}>
                <Box>
                    <Typography
                        variant="h6"
                        sx={navBarTitle}
                        component="button"
                        onClick={handleMenuOpen}
                        style={{ textDecoration: 'none', color: 'inherit', marginLeft: '16px', background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                        Meta-Text
                    </Typography>
                    <Menu
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleMenuClose}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                    >
                        {!user && (
                            <MenuItem onClick={() => handleMenuClick('/login')} selected={isActive('/login')}>
                                Login
                            </MenuItem>
                        )}
                        {!user && (
                            <MenuItem onClick={() => handleMenuClick('/register')} selected={isActive('/register')}>
                                Register
                            </MenuItem>
                        )}
                        {user && (
                            <MenuItem onClick={handleLogout}>
                                Logout
                            </MenuItem>
                        )}
                    </Menu>
                </Box>
                <Box sx={{ flexGrow: 8 }} />
                <ChunkToolsNavbar />
            </Toolbar>
        </AppBar>
    );
};

export default NavBar;

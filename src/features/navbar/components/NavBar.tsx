import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useAuth } from '../../../store/authStore';
import { navBarAppBar, navBarToolbar, navBarTitle } from '../styles/styles';
import ChunkToolsNavbar from '../../chunks/tools/ChunkToolsNavbar';

interface NavBarButtonProps {
    to?: string;
    children: React.ReactNode;
    onClick?: () => void;
    active?: boolean;
}

const NavBarButton: React.FC<NavBarButtonProps> = ({ to, children, onClick, active }) => {
    const buttonProps: any = {
        onClick,
        color: active ? 'primary' : 'inherit',
    };
    if (to) {
        buttonProps.component = Link;
        buttonProps.to = to;
    }
    return (
        <Button {...buttonProps} sx={{ marginLeft: '16px', textTransform: 'none' }}>
            {children}
        </Button>
    );
};

const NavBar: React.FC = () => {
    const location = useLocation();
    const { user, logout } = useAuth();
    const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path);
    return (
        <AppBar position="fixed" elevation={2} sx={navBarAppBar}>
            <Toolbar sx={navBarToolbar}>
                <Box>
                    <Typography
                        variant="h6"
                        sx={navBarTitle}
                        component={Link}
                        to="/"
                        style={{ textDecoration: 'none', color: 'inherit', marginLeft: '16px' }}
                    >
                        Meta-Text
                    </Typography>
                    {!user && (
                        <NavBarButton to="/login" active={isActive('/login')} >Login</NavBarButton>
                    )}
                    {!user && (
                        <NavBarButton to="/register" active={isActive('/register')}>Register</NavBarButton>
                    )}
                    {user && (
                        <NavBarButton onClick={logout}>Logout</NavBarButton>
                    )}

                </Box>
                <Box sx={{ flexGrow: 8 }} />
                <ChunkToolsNavbar />
            </Toolbar>
        </AppBar>
    );
};

export default NavBar;

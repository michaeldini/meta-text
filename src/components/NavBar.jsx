import { Link, useLocation } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useAuth } from '../store/authStore';
import { navBarAppBar, navBarToolbar, navBarButton, navBarTitle } from '../styles/pageStyles';

function NavBarButton({ to, children, onClick, active, ml = 0 }) {
    return (
        <Button
            component={to ? Link : undefined}
            to={to}
            onClick={onClick}
            color={active ? 'primary' : 'inherit'}
            variant={active ? 'contained' : 'text'}
            sx={navBarButton(active, ml)}
        >
            {children}
        </Button>
    );
}

export default function NavBar() {
    const location = useLocation();
    const { user, logout } = useAuth();
    const isActive = (path) => location.pathname === path || location.pathname.startsWith(path);
    return (
        <AppBar position="fixed" elevation={2} sx={navBarAppBar}>
            <Toolbar sx={navBarToolbar}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <NavBarButton to="/sourceDocs" active={isActive('/sourceDocs')}>Source Docs</NavBarButton>
                    <NavBarButton to="/metaText" active={isActive('/metaText')}>Meta Texts</NavBarButton>
                    {!user && (
                        <NavBarButton to="/login" active={isActive('/login')} ml={2}>Login</NavBarButton>
                    )}
                    {!user && (
                        <NavBarButton to="/register" active={isActive('/register')} ml={1}>Register</NavBarButton>
                    )}
                    {user && (
                        <NavBarButton onClick={logout} ml={2}>Logout</NavBarButton>
                    )}
                </Box>
                <Typography variant="h6" sx={navBarTitle}>
                    Meta-Text
                </Typography>
            </Toolbar>
        </AppBar>
    );
}

import { Link, useLocation } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useAuth } from '../store/authStore';

function NavBarButton({ to, children, onClick, active, ml = 0 }) {
    return (
        <Button
            component={to ? Link : undefined}
            to={to}
            onClick={onClick}
            color={active ? 'primary' : 'inherit'}
            variant={active ? 'contained' : 'text'}
            sx={{
                fontWeight: active ? 600 : 400,
                borderRadius: 2,
                textTransform: 'none',
                px: 2,
                boxShadow: active ? 2 : 0,
                bgcolor: active ? 'primary.main' : 'transparent',
                color: active ? 'background.paper' : 'text.primary',
                '&:hover': {
                    bgcolor: active ? 'primary.dark' : 'action.hover',
                },
                ml,
            }}
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
        <AppBar position="fixed" elevation={2} sx={{ bgcolor: 'background.paper', color: 'text.primary', zIndex: 1201 }}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'right', minHeight: 64 }}>
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
                <Typography variant="h6" sx={{ textTransform: 'uppercase', fontWeight: 700, letterSpacing: 2, color: 'primary.main', pl: 2 }}>
                    Meta-Text
                </Typography>
            </Toolbar>
        </AppBar>
    );
}

import { Link, useLocation } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const navLinks = [
    { to: '/sourceDocs', label: 'Source Docs' },
    { to: '/metaText', label: 'Meta Texts' },
];

export default function NavBar() {
    const location = useLocation();
    return (
        <AppBar position="fixed" elevation={2} sx={{ bgcolor: 'background.paper', color: 'text.primary', zIndex: 1201 }}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'right', minHeight: 64 }}>
                <Box sx={{ display: 'flex', gap: 2, }}>
                    {navLinks.map(link => (
                        <Button
                            key={link.to}
                            component={Link}
                            to={link.to}
                            color={location.pathname === link.to || location.pathname.startsWith(link.to) ? 'primary' : 'inherit'}
                            variant={location.pathname === link.to || location.pathname.startsWith(link.to) ? 'contained' : 'text'}
                            sx={{
                                fontWeight: location.pathname === link.to || location.pathname.startsWith(link.to) ? 600 : 400,
                                borderRadius: 2,
                                textTransform: 'none',
                                px: 2,
                                boxShadow: location.pathname === link.to || location.pathname.startsWith(link.to) ? 2 : 0,
                                bgcolor: location.pathname === link.to || location.pathname.startsWith(link.to) ? 'primary.main' : 'transparent',
                                color: location.pathname === link.to || location.pathname.startsWith(link.to) ? 'background.paper' : 'text.primary',
                                '&:hover': {
                                    bgcolor: location.pathname === link.to || location.pathname.startsWith(link.to) ? 'primary.dark' : 'action.hover',
                                },
                            }}
                        >
                            {link.label}
                        </Button>
                    ))}
                </Box>
                <Typography variant="h6" sx={{ textTransform: 'uppercase', fontWeight: 700, letterSpacing: 2, color: 'primary.main', pl: 2 }}>
                    Meta-Text
                </Typography>
            </Toolbar>
        </AppBar>
    );
}

import React from 'react';
import { Box, Button, Typography, Container } from '@mui/material';
import NavMenu from './NavMenu';
import { useAuth } from 'store';
import { useNavigation } from '../hooks';
import { getNavigationConfig } from '../navigationConfig';

interface NavBarHeaderProps {
    styles: any;
}

const NavBarHeader: React.FC<NavBarHeaderProps> = ({ styles }) => {
    // Get user and logout from auth context
    const { user, logout } = useAuth();
    // Get navigation config
    const navConfig = getNavigationConfig(logout).config;
    // Use navigation hook
    const { navigationItems, isActive, handleItemClick } = useNavigation({
        user,
        onLogout: logout,
        config: navConfig,
    });
    // Brand item from config
    const brandNavItem = navConfig.brand;

    return (
        <Container maxWidth="xl" sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
            <Box sx={styles.section}>
                {/* Brand/Logo Button - Takes user to homepage */}
                <Button
                    sx={styles.brandButton}
                    onClick={() => handleItemClick(brandNavItem)}
                    aria-label={`Go to homepage - ${brandNavItem?.label}`}
                    data-testid="nav-brand-button"
                >
                    <Typography
                        component="span"
                        variant="h6"
                        noWrap
                        sx={{ fontFamily: 'monospace', fontWeight: 700, letterSpacing: '.2rem', color: 'inherit', textDecoration: 'none' }}
                        data-testid="nav-brand"
                    >
                        {brandNavItem?.label}
                    </Typography>
                </Button>

                <NavMenu
                    navigationItems={navigationItems}
                    isActive={isActive}
                    handleMenuItemClick={handleItemClick}
                    styles={styles}
                />
            </Box>
        </Container>
    );
};

export default NavBarHeader;

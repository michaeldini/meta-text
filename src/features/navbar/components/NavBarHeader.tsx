// Header component for the navigation bar
// Provides the brand button and navigation menu, integrating with authentication and navigation hooks.

import React from 'react';
import { Box, Container } from '@mui/material';
import NavMenu from './NavMenu';
import { useAuth } from 'store';
import { useNavigation } from '../hooks';
import { getNavigationConfig } from '../navigationConfig';
import BrandButton from './BrandButton';

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
        <Container maxWidth="xl" data-testid="navbar-header">
            <Box sx={styles.container}>
                <BrandButton
                    brandNavItem={brandNavItem}
                    styles={{
                        brandButton: styles.brandButton,
                        brandTypography: styles.brandTypography,
                    }}
                    handleClick={() => handleItemClick(brandNavItem)}
                />
                <NavMenu
                    navigationItems={navigationItems}
                    isActive={isActive}
                    handleMenuItemClick={handleItemClick}
                />
            </Box>
        </Container>
    );
};

export default NavBarHeader;

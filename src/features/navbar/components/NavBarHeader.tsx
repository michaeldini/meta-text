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
        <Container maxWidth="xl" sx={styles.headerContainer} data-testid="navbar-header">
            <Box sx={styles.section}>
                <BrandButton
                    brandNavItem={brandNavItem}
                    styles={styles}
                    handleClick={() => handleItemClick(brandNavItem)}
                />
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

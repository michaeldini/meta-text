/**
 * NavBarHeader component
 * - Displays logo and navigation menu
 * - Uses Material UI Container and Box for layout
 */
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

    /**
     * Get user authentication and navigation configuration
     * - Uses custom hook to get user data and logout function
     * - Retrieves navigation items based on user role and preferences
     * - Handles navigation item clicks and active state
     */
    const { user, logout } = useAuth();
    const navConfig = getNavigationConfig(logout).config;
    const { navigationItems, isActive, handleItemClick } = useNavigation({
        user,
        onLogout: logout,
        config: navConfig,
    });

    // The logo is not in the menu, so we handle it separately
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

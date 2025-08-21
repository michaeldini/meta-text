/**
 * The Navbar contains a
 * - logo that redirects to home
 * - Dynamic Login/Register/Logout buttons
 * - Chakra UI Color-mode button (toggle light/dark theme)
 */
import React from 'react';
import { Flex, Box, Button, Spacer } from '@chakra-ui/react';
import { ColorModeButton } from '@components/ui/color-mode';
import { useNavigate } from 'react-router-dom';

import { useAuthStore } from '@store/authStore';
import { getNavigationConfig } from './navigationConfig';
import { filterNavItems } from './utils';


/**
 * Main NavBar component
 * - Gathers navigation configuration, auth state, and theme.
 * - Maps over navItems config to render navigation buttons.
 */
export function NavBar() {

    // Get authentication state and navigation functions
    const user = useAuthStore(state => state.user);
    const logout = useAuthStore(state => state.logout);
    const navigate = useNavigate();
    const navConfig = getNavigationConfig(logout, navigate);

    // Filter items based on authentication
    const isAuthenticated = !!user;
    const navItems = filterNavItems(navConfig.items, isAuthenticated);

    return (
        <Flex
            as="nav"
            data-testid="navbar"
        >
            <Flex align="center" gap={2}>
                {navItems.map(item => (
                    <Button
                        key={item.label}
                        onClick={item.action}
                        color="fg"
                        size="xl"
                        fontWeight="medium"
                    >
                        {item.icon ? <item.icon /> : undefined}
                        {item.label}
                    </Button>
                ))}
            </Flex>
            <Spacer />
            <Box>
                <ColorModeButton />
            </Box>
        </Flex>
    );
}

export default NavBar;
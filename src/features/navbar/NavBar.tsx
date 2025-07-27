
/**
 * Navigation bar for the application.
 * - Basic navigation structure.
 * - Renders buttons for navigation links and actions from config (with icons and labels)
 * - Shows/hides items based on authentication
 * - Uses Material UI AppBar and Toolbar for layout
 * - Theme toggle button included
 */

import React from 'react';
import { Flex, Box, Button, IconButton, Spacer } from '@chakra-ui/react';
import { ColorModeButton } from 'components';
import { useNavigate } from 'react-router-dom';

import { useAuthStore } from 'store';


import { getNavigationConfig } from './navigationConfig';


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
    const navItems = navConfig.items.filter(item => {
        if (item.label === 'Login') return !isAuthenticated;
        if (item.label === 'Register') return !isAuthenticated;
        if (item.label === 'Logout') return isAuthenticated;
        return item.protected ? isAuthenticated : true;
    });

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
                        variant="ghost"
                        color="primary"
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
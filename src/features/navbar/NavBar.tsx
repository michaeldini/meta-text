/**
 * The Navbar contains a
 * - logo that redirects to home
 * - Dynamic Login/Register/Logout buttons
 * - Chakra UI Color-mode button (toggle light/dark theme)
 */
import React from 'react';
import { Flex, Box, Button } from '@styles';
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
        <Flex as="nav" css={{ alignItems: 'center', width: '100%', py: 8, px: 16 }} data-testid="navbar">
            <Flex css={{ alignItems: 'center', gap: '12px' }}>
                {navItems.map(item => (
                    <Button
                        key={item.label}
                        onClick={item.action}
                        size="lg"
                        css={{ fontWeight: 500 }}
                    >
                        {item.icon ? <span style={{ marginRight: 6 }}><item.icon /></span> : null}
                        {item.label}
                    </Button>
                ))}
            </Flex>
            <Box css={{ flex: 1 }} />
        </Flex>
    );
}

export default NavBar;
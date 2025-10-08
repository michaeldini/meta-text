/**
 * 
 * NavBar component for the application.
 * 
 * Sits at the top of the app and provides navigation links.
 *
 * Layout:
 * - logo that redirects to home
 * - Dynamic Login/Register/Logout buttons
 * 
 * Uses authentication state to conditionally render navigation items.
 * If user is logged in, shows Logout button.
 * If user is not logged in, shows Login and Register buttons.
 * The function `filterNavItems` is used to filter the navigation items based on authentication state.
 * 
 * Navigation items are defined in a separate configuration file and filtered based on auth state.
 * 
 * Utilizes React Router's useNavigate for client-side navigation.
 * 
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@store/authStore';
import { getNavigationConfig } from './navigationConfig';
import { filterNavItems } from './utils';
import { Row, IconWrapper } from '@styles';
import { Button } from '@components/ui/button';


/**
 * NavBar component.
 *
 * Renders the application's top navigation bar and navigation items filtered
 * by authentication state. Uses the auth store to determine the current user
 * and logout action, and React Router's useNavigate for client-side routing.
 *
 * The component:
 * - Reads the user and logout action from the auth store.
 * - Builds navigation configuration and filters items using filterNavItems.
 * - Renders a list of buttons with optional icons that trigger the provided actions.
 *
 * @returns {JSX.Element} The rendered navigation bar element.
 */
export function NavBar() {

    /**
     * The currently authenticated user from the auth store.
     *
     * This value will be the user object when a session exists, or null/undefined
     * when no user is authenticated. Consumers should check for truthiness before
     * accessing user properties.
     *
     * Example:
     * const name = user?.name;
     */
    const user = useAuthStore(state => state.user);

    /**
     * Logout action obtained from the auth store.
     *
     * Calling this function triggers the application's logout flow (clearing
     * auth state, tokens, and performing any necessary cleanup). It may be
     * synchronous or return a Promise depending on the auth implementation.
     *
     * Example:
     * await logout();
     */
    const logout = useAuthStore(state => state.logout);

    /**
     * Navigation function from React Router.
     *
     * Use this function to perform client-side navigation within the application.
     * Typical usage: navigate('/path') or navigate(-1) for backward navigation.
     *
     * The shape follows React Router's navigate utility; refer to react-router docs
     * for details on overloads and options.
     */
    const navigate = useNavigate();

    /**
     * Navigation configuration used to build the NavBar items.
     *
     * This object is returned by getNavigationConfig and contains the list of
     * navigation items, labels, icons and actions (e.g., login, logout, go home).
     * It is passed to the filtering utility to produce the displayed items.
     */
    const navConfig = getNavigationConfig(logout, navigate);


    /**
     * Whether a user is authenticated.
     *
     * Derived from the auth store user value. Used to filter the navigation items
     * that should be visible to authenticated vs unauthenticated users.
     * 
     * Syntax: double negation to convert user object to boolean.
     * Example: !!user will be true if user is an object, false if null/undefined.
     */
    const isAuthenticated = !!user;

    /**
     * The final list of navigation items to render in the NavBar.
     *
     * Obtained by filtering navConfig.items with the current authentication state.
     * Each item typically contains a label, optional icon and an action callback.
     *
     * Example item shape:
     * { label: string, icon?: React.ComponentType, action: () => void }
     */
    const navItems = filterNavItems(navConfig.items, isAuthenticated);

    return (
        <Row as="nav" data-testid="navbar">
            {navItems.map(item => (
                <Button
                    key={item.label}
                    onClick={item.action}
                    css={{ fontWeight: 500 }}
                    icon={item.icon ? <IconWrapper><item.icon /></IconWrapper> : undefined}
                >
                    {item.label}
                </Button>
            ))}
        </Row>
    );
}

export default NavBar;
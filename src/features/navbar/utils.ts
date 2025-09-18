/**
 * Utility helpers for the navbar feature.
 *
 * Keeps filtering logic in a single place so the component stays focused on rendering.
 */
import { getNavigationConfig } from './navigationConfig';

// Reuse the NavigationItem shape from the navigation config return type
export type NavItem = ReturnType<typeof getNavigationConfig>['items'][number];

/**
 * Filter navigation items based on authentication state.
 * - Shows Logout and Hides Login/Register when authenticated
 * - Shows Login/Register and Hides Logout when not authenticated
 * - Respects `protected` flag for other items
 */
export function filterNavItems(items: NavItem[], isAuthenticated: boolean): NavItem[] {
    return items.filter(item => {
        if (item.label === 'Login') return !isAuthenticated;
        if (item.label === 'Register') return !isAuthenticated;
        if (item.label === 'Logout') return isAuthenticated;
        return item.protected ? isAuthenticated : true;
    });
}

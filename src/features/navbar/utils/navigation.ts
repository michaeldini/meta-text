import { NavigationItem, User, NavigationError } from '../types';

/**
 * Default navigation configuration
 */
export const DEFAULT_ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
} as const;

/**
 * Creates navigation items based on authentication state
 * @param onNavigate - Function to handle navigation
 * @param onLogout - Function to handle logout
 * @returns Array of default navigation items
 */
export const createDefaultNavigationItems = (
    onNavigate: (path: string) => void,
    onLogout: () => void
): NavigationItem[] => [
        {
            id: 'home',
            label: 'Home',
            path: DEFAULT_ROUTES.HOME,
            showWhen: 'authenticated',
        },
        {
            id: 'login',
            label: 'Login',
            path: DEFAULT_ROUTES.LOGIN,
            showWhen: 'unauthenticated',
        },
        {
            id: 'register',
            label: 'Register',
            path: DEFAULT_ROUTES.REGISTER,
            showWhen: 'unauthenticated',
        },
        {
            id: 'logout',
            label: 'Logout',
            action: onLogout,
            showWhen: 'authenticated',
        },
    ];

/**
 * Filters navigation items based on authentication state
 * @param items - Array of navigation items to filter
 * @param user - Current user object or null
 * @returns Filtered array of navigation items
 */
export const filterNavigationItems = (
    items: NavigationItem[],
    user: User | null
): NavigationItem[] => {
    return items.filter(item => {
        switch (item.showWhen) {
            case 'authenticated':
                return !!user;
            case 'unauthenticated':
                return !user;
            case 'always':
                return true;
            default:
                return false;
        }
    });
};

/**
 * Checks if a navigation path is currently active
 * @param currentPath - Current route path
 * @param itemPath - Navigation item path to check
 * @returns Boolean indicating if the route is active
 */
export const isActiveRoute = (currentPath: string, itemPath?: string): boolean => {
    if (!itemPath) return false;
    if (currentPath === itemPath) return true;

    // For nested routes, check if current path starts with item path
    // but make sure we don't match partial segments
    if (itemPath !== '/' && currentPath.startsWith(itemPath)) {
        const nextChar = currentPath[itemPath.length];
        return nextChar === '/' || nextChar === undefined;
    }

    return false;
};

/**
 * Handles navigation item clicks with error handling
 * @param item - Navigation item that was clicked
 * @param onNavigate - Function to handle navigation
 * @param onClose - Optional function to close menus
 * @param onError - Optional error handler
 */
export const handleNavigationClick = (
    item: NavigationItem,
    onNavigate: (path: string) => void,
    onClose?: () => void,
    onError?: (error: NavigationError) => void
) => {
    try {
        if (item.disabled) {
            onError?.({
                type: 'permission',
                message: `Navigation to ${item.label} is disabled`,
                item,
            });
            return;
        }

        if (item.path) {
            onNavigate(item.path);
        } else if (item.action) {
            item.action();
        } else {
            onError?.({
                type: 'navigation',
                message: `No action or path defined for ${item.label}`,
                item,
            });
            return;
        }

        onClose?.();
    } catch (error) {
        onError?.({
            type: 'navigation',
            message: `Failed to navigate: ${error instanceof Error ? error.message : 'Unknown error'}`,
            item,
        });
    }
};

import { useMemo, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { NavigationItem, User, NavigationError } from '../types';
import {
    createDefaultNavigationItems,
    filterNavigationItems,
    isActiveRoute,
    handleNavigationClick
} from '../utils/navigation';

interface UseNavigationProps {
    user: User | null;
    onLogout: () => void;
    customItems?: NavigationItem[];
    onError?: (error: NavigationError) => void;
}

interface UseNavigationReturn {
    navigationItems: NavigationItem[];
    isActive: (path?: string) => boolean;
    handleItemClick: (item: NavigationItem, onClose?: () => void) => void;
    currentPath: string;
}

/**
 * Hook for managing navigation state and actions
 * @param props - Navigation configuration and handlers
 * @returns Navigation state and handlers
 */
export const useNavigation = ({
    user,
    onLogout,
    customItems,
    onError
}: UseNavigationProps): UseNavigationReturn => {
    const location = useLocation();
    const navigate = useNavigate();

    // Memoize navigation handler to prevent unnecessary re-renders
    const handleNavigate = useCallback((path: string) => {
        try {
            navigate(path);
        } catch (error) {
            onError?.({
                type: 'navigation',
                message: `Failed to navigate to ${path}: ${error instanceof Error ? error.message : 'Unknown error'}`,
            });
        }
    }, [navigate, onError]);

    // Memoize logout handler
    const handleLogout = useCallback(() => {
        try {
            onLogout();
        } catch (error) {
            onError?.({
                type: 'authentication',
                message: `Logout failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
            });
        }
    }, [onLogout, onError]);

    // Create navigation items with optimized dependencies
    const allNavigationItems = useMemo(() => {
        const defaultItems = createDefaultNavigationItems(handleNavigate, handleLogout);
        return customItems ? [...defaultItems, ...customItems] : defaultItems;
    }, [handleNavigate, handleLogout, customItems]);

    // Filter items based on authentication state
    const visibleNavigationItems = useMemo(() => {
        return filterNavigationItems(allNavigationItems, user);
    }, [allNavigationItems, user]);

    // Memoize active route checker for better performance
    const checkIsActive = useCallback((path?: string) => {
        return isActiveRoute(location.pathname, path);
    }, [location.pathname]);

    // Handle navigation item click with error handling
    const handleItemClick = useCallback((item: NavigationItem, onClose?: () => void) => {
        handleNavigationClick(item, handleNavigate, onClose, onError);
    }, [handleNavigate, onError]);

    return {
        navigationItems: visibleNavigationItems,
        isActive: checkIsActive,
        handleItemClick,
        currentPath: location.pathname,
    };
};

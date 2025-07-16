import { useMemo, useCallback } from 'react';
import { resetAppState } from 'utils';
import { useLocation, useNavigate } from 'react-router-dom';
import { NavigationItem, User, NavBarProps } from '../types';
import {
    filterNavigationItems,
    isActiveRoute,
    handleNavigationClick
} from '../utils/navigation';

interface UseNavigationProps {
    user: User | null;
    onLogout: () => void;
    config: NavBarProps['config'];
}

interface UseNavigationReturn {
    navigationItems: NavigationItem[];
    isActive: (path?: string) => boolean;
    handleItemClick: (item: NavigationItem, onClose?: () => void) => void;
    currentPath: string;
}

/**
 * Hook for managing navigation state and actions (NavBarProps model)
 * @param props - Navigation configuration and handlers
 * @returns Navigation state and handlers
 */
export const useNavigation = ({
    user,
    onLogout,
    config
}: Omit<UseNavigationProps, 'onError'>): UseNavigationReturn => {
    const location = useLocation();
    const navigate = useNavigate();

    // Memoize navigation handler to prevent unnecessary re-renders
    const handleNavigate = useCallback((path: string) => {
        navigate(path);
    }, [navigate]);

    // Memoize logout handler: clear app state before running onLogout
    const handleLogout = useCallback(() => {
        resetAppState();
        onLogout();
    }, [onLogout]);

    // Compose navigation items from config, wiring up logout action
    const allNavigationItems = useMemo(() => {
        return config.items.map(item =>
            item.id === 'logout' ? { ...item, action: handleLogout } : item
        );
    }, [config.items, handleLogout]);

    // Filter items based on authentication state
    const visibleNavigationItems = useMemo(() => {
        return filterNavigationItems(allNavigationItems, user);
    }, [allNavigationItems, user]);

    // Memoize active route checker for better performance
    const checkIsActive = useCallback((path?: string) => {
        return isActiveRoute(location.pathname, path);
    }, [location.pathname]);

    // Handle navigation item click
    const handleItemClick = useCallback((item: NavigationItem, onClose?: () => void) => {
        handleNavigationClick(item, handleNavigate, onClose);
    }, [handleNavigate]);

    return {
        navigationItems: visibleNavigationItems,
        isActive: checkIsActive,
        handleItemClick,
        currentPath: location.pathname,
    };
};

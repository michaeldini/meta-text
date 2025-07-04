/**
 * NavBar Feature Exports
 * Centralized exports for the navigation bar feature
 */

// Main Component
export { default as NavBar } from './NavBar';

export { getNavigationConfig } from './navigationConfig';
// Types
export type {
    NavBarProps,
    NavigationItem,
    User,
} from './types';

// Hooks
export { useNavigation } from './hooks/useNavigation';


// Utilities
export {
    createDefaultNavigationItems,
    filterNavigationItems,
    isActiveRoute,
    handleNavigationClick,
    DEFAULT_ROUTES,
} from './utils/navigation';

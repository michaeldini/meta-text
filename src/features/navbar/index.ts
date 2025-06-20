/**
 * NavBar Feature Exports
 * Centralized exports for the navigation bar feature
 */

// Main Component
export { default as NavBar } from './components/NavBar';

// Types
export type {
    NavBarProps,
    NavigationConfig,
    NavigationItem,
    User,
} from './types';

// Hooks
export { useNavigation } from './hooks/useNavigation';
export { useDropdownMenu } from './hooks/useDropdownMenu';

// Utilities
export {
    createDefaultNavigationItems,
    filterNavigationItems,
    isActiveRoute,
    handleNavigationClick,
    DEFAULT_ROUTES,
} from './utils/navigation';

// Constants for common configurations
export const DEFAULT_NAVBAR_CONFIG = {
    brand: {
        label: 'Meta-Text',
        path: '/',
    },
    items: [],
} as const;

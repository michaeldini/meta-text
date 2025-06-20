// Navigation Types - Better type safety and organization
export interface User {
    id: number;
    username: string;
    email?: string;
}

export interface NavigationItem {
    id: string;
    label: string;
    path?: string;
    action?: () => void;
    icon?: React.ReactNode;
    showWhen: 'authenticated' | 'unauthenticated' | 'always';
    disabled?: boolean;
    badge?: string | number;
}

export interface NavigationConfig {
    items?: NavigationItem[];
    brand?: {
        label: string;
        path: string;
    };
}

export interface NavBarProps {
    config?: NavigationConfig;
    renderToolbar?: () => React.ReactNode;
    className?: string;
    'data-testid'?: string;
}

// Enhanced types for better error handling and type safety
export interface NavigationError {
    type: 'navigation' | 'authentication' | 'permission';
    message: string;
    item?: NavigationItem;
}

export interface NavigationEventHandlers {
    onNavigate?: (path: string) => void;
    onAction?: (action: () => void) => void;
    onError?: (error: NavigationError) => void;
}

export interface BrandConfig {
    label: string;
    path: string;
    icon?: React.ReactNode;
    onClick?: () => void;
}

// Constants for better maintainability
export const NAVIGATION_ITEM_SHOW_WHEN = {
    AUTHENTICATED: 'authenticated',
    UNAUTHENTICATED: 'unauthenticated',
    ALWAYS: 'always',
} as const;

export type NavigationShowWhen = typeof NAVIGATION_ITEM_SHOW_WHEN[keyof typeof NAVIGATION_ITEM_SHOW_WHEN];

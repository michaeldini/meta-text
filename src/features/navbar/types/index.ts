import { IconProps } from 'icons';
// Navigation Types - Better type safety and organization
export interface User {
    id: number;
    username: string;
    email?: string;
}

export interface NavigationItem {
    id: string;
    label: string;
    path: string;
    action?: () => void;
    icon?: IconProps;
    showWhen: 'authenticated' | 'unauthenticated' | 'always';
    disabled?: boolean;
}

export interface NavBarProps {
    config: {
        brand: NavigationItem;
        items: NavigationItem[];
    };
}

export interface NavigationError {
    type: 'navigation' | 'authentication' | 'permission';
    message: string;
    item?: NavigationItem;
}

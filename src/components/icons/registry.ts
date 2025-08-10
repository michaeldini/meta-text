import { getIconComponent } from '@components/icons/registry';
/**
 * Central icon registry.
 * - Provides semantic, domain-oriented names for icon components.
 * - Enforces single import surface for vendor icons (react-icons/hi2).
 * - Works with custom ESLint rule (local/no-direct-heroicons) to prevent scattered imports.
 * - Add new icons here and reference by IconName elsewhere.
 */
import React from 'react';

// Semantic aliases mapped to vendor icons.
export const icons = {
    Academic: getIconComponent('Academic'),
    Back: getIconComponent('Back'),
    PagePrev: getIconComponent('PagePrev'),
    PageNext: getIconComponent('PageNext'),
    AISparkle: getIconComponent('AISparkle'),
    Download: getIconComponent('Download'),
    Confirm: getIconComponent('Confirm'),
    EditOutline: getIconComponent('EditOutline'),
    Close: getIconComponent('Close'),
    Help: getIconComponent('Help'),
    BookmarkFilled: getIconComponent('BookmarkFilled'),
    Bookmark: getIconComponent('Bookmark'),
    Undo: getIconComponent('Undo'),
    Search: getIconComponent('Search'),
    Split: getIconComponent('Split'),
    EditSquare: getIconComponent('EditSquare'),
    FavoriteFilled: getIconComponent('FavoriteFilled'),
    Favorite: getIconComponent('Favorite'),
    Image: getIconComponent('Image'),
    Document: getIconComponent('Document'),
    Login: getIconComponent('Login'),
    Logout: getIconComponent('Logout'),
    Add: getIconComponent('Add'),
    DeleteOutline: getIconComponent('DeleteOutline'),
    Positions: getIconComponent('Positions'),
    Menu: getIconComponent('Menu'),
} as const;

export type IconName = keyof typeof icons;

export interface IconProps extends Omit<React.SVGProps<SVGSVGElement>, 'ref'> {
    name: IconName;
    size?: number | string; // convenience (maps to width/height via react-icons size prop)
    title?: string; // accessible label (adds <title>)
    // color, className, etc are passed through
}

/**
 * Generic Icon component referencing the registry.
 * Keeps vendor decoupled from call site and standardizes accessibility.
 */
export const Icon: React.FC<IconProps> = ({ name, size = 20, title, ...rest }) => {
    const Cmp = icons[name];
    // react-icons components accept: size, color, className, ...svg props
    const ariaProps = title
        ? { role: 'img', 'aria-label': title }
        : { 'aria-hidden': true };
    return React.createElement(
        Cmp as any,
        { size, ...ariaProps, ...rest },
        title ? React.createElement('title', null, title) : undefined
    );
};

/** Utility to resolve icon component for advanced scenarios (e.g., custom wrappers) */
export function getIconComponent(name: IconName) {
    return icons[name];
}

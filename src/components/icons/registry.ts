/**
 * Central icon registry.
 * - Provides semantic, domain-oriented names for icon components.
 * - Enforces single import surface for vendor icons (react-icons/hi2).
 * - Works with custom ESLint rule (local/no-direct-heroicons) to prevent scattered imports.
 * - Add new icons here and reference by IconName elsewhere.
 */
import React from 'react';
import {
    HiAcademicCap,
    HiArrowLeft,
    HiChevronLeft,
    HiChevronRight,
    HiOutlineSparkles,
    HiArrowDownTray,
    HiCheck,
    HiOutlinePencil,
    HiXMark,
    HiQuestionMarkCircle,
    HiBookmark,
    HiOutlineBookmark,
    HiArrowUturnLeft,
    HiMagnifyingGlass,
    HiScissors,
    HiPencilSquare,
    HiStar,
    HiOutlineStar,
    HiPhoto,
    HiDocumentText,
    HiArrowRightOnRectangle,
    HiArrowLeftOnRectangle,
    HiPlus,
    HiOutlineTrash,
    HiHashtag,
    HiBars3,
} from 'react-icons/hi2';

// Semantic aliases mapped to vendor icons.
export const icons = {
    Academic: HiAcademicCap,
    Back: HiArrowLeft,
    PagePrev: HiChevronLeft,
    PageNext: HiChevronRight,
    AISparkle: HiOutlineSparkles,
    Download: HiArrowDownTray,
    Confirm: HiCheck,
    EditOutline: HiOutlinePencil,
    Close: HiXMark,
    Help: HiQuestionMarkCircle,
    BookmarkFilled: HiBookmark,
    Bookmark: HiOutlineBookmark,
    Undo: HiArrowUturnLeft,
    Search: HiMagnifyingGlass,
    Split: HiScissors,
    EditSquare: HiPencilSquare,
    FavoriteFilled: HiStar,
    Favorite: HiOutlineStar,
    Image: HiPhoto,
    Document: HiDocumentText,
    Login: HiArrowRightOnRectangle,
    Logout: HiArrowLeftOnRectangle,
    Add: HiPlus,
    DeleteOutline: HiOutlineTrash,
    Positions: HiHashtag,
    Menu: HiBars3,
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

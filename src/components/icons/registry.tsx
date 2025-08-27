// /**
//  * Central icon registry.
//  * - Provides semantic, domain-oriented names for icon components.
//  * - Enforces single import surface for vendor icons (react-icons/hi2).
//  * - Works with custom ESLint rule (local/no-direct-heroicons) to prevent scattered imports.
//  * - Add new icons here and reference by IconName elsewhere.
//  */
// /* eslint-disable local/no-direct-heroicons */
// import React from 'react';
// import {
//     HiAcademicCap,
//     HiArrowLeft,
//     HiChevronLeft,
//     HiChevronRight,
//     HiOutlineSparkles,
//     HiArrowDownTray,
//     HiCheck,
//     HiOutlinePencil,
//     HiXMark,
//     HiQuestionMarkCircle,
//     HiBookmark,
//     HiOutlineBookmark,
//     HiArrowUturnLeft,
//     HiMagnifyingGlass,
//     HiScissors,
//     HiPencilSquare,
//     HiStar,
//     HiOutlineStar,
//     HiPhoto,
//     HiDocumentText,
//     HiArrowRightOnRectangle,
//     HiArrowLeftOnRectangle,
//     HiPlus,
//     HiOutlineTrash,
//     HiHashtag,
//     HiBars3,
//     HiArrowsPointingOut,
//     HiArrowsPointingIn,
// } from 'react-icons/hi2';

// // Semantic aliases mapped directly to vendor icons.
// export const icons = {
//     Academic: HiAcademicCap,
//     Back: HiArrowLeft,
//     PagePrev: HiChevronLeft,
//     PageNext: HiChevronRight,
//     AISparkle: HiOutlineSparkles,
//     Download: HiArrowDownTray,
//     Confirm: HiCheck,
//     EditOutline: HiOutlinePencil,
//     Close: HiXMark,
//     Help: HiQuestionMarkCircle,
//     BookmarkFilled: HiBookmark,
//     Bookmark: HiOutlineBookmark,
//     Undo: HiArrowUturnLeft,
//     Search: HiMagnifyingGlass,
//     Split: HiScissors,
//     EditSquare: HiPencilSquare,
//     FavoriteFilled: HiStar,
//     Favorite: HiOutlineStar,
//     Image: HiPhoto,
//     Document: HiDocumentText,
//     Login: HiArrowRightOnRectangle,
//     Logout: HiArrowLeftOnRectangle,
//     Add: HiPlus,
//     DeleteOutline: HiOutlineTrash,
//     Positions: HiHashtag,
//     Menu: HiBars3,
//     Exppand: HiArrowsPointingOut,
//     Collapse: HiArrowsPointingIn,
// } as const;

// export type IconName = keyof typeof icons;

// /** Utility to resolve icon component for advanced scenarios */
// export function getIconComponent(name: IconName) {
//     return icons[name];
// }

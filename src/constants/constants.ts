export const NOTIFICATION_CONSTANTS = {
    STACK_OFFSET: 70, // Vertical spacing between stacked notifications
    POSITION_RIGHT: 16, // Right margin for notifications
    POSITION_BOTTOM: 16, // Bottom margin for notifications
    Z_INDEX: 1400, // Z-index for notifications
    MIN_WIDTH: 300, // Minimum width for notification alerts
} as const;

export const LOADING_CONSTANTS = {
    MIN_HEIGHT_BOUNDARY: 120, // Minimum height for LoadingBoundary
    MIN_HEIGHT_SUSPENSE: 200, // Minimum height for AppSuspenseFallback
} as const;

export const ROUTES = {
    SOURCE_DOC: '/source-document',
    META_TEXT: '/metaText',
} as const;

export const MESSAGES = {
    DELETE_SUCCESS: {
        sourceDoc: 'Source document deleted successfully.',
        metaText: 'Meta text deleted successfully.',
    } as const,
    DELETE_ERROR: {
        sourceDoc: 'Failed to delete the source document. Please try again.',
        metaText: 'Failed to delete the meta text. Please try again.',
    } as const,
} as const;

export const NAVBAR_CONFIG = {
    brand: {
        label: 'Meta-Text',
        path: '/',
    },
    items: [
        {
            id: 'about',
            label: 'About',
            path: '/about',
            showWhen: 'always' as const,
        },
    ],
};



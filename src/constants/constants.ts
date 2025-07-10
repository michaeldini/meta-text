
// For GlobalNotification.tsx
export const NOTIFICATION_CONSTANTS = {
    STACK_OFFSET: 70, // Vertical spacing between stacked notifications
    POSITION_RIGHT: 16, // Right margin for notifications
    POSITION_BOTTOM: 16, // Bottom margin for notifications
    Z_INDEX: 1400, // Z-index for notifications
    MIN_WIDTH: 300, // Minimum width for notification alerts
} as const;

// For LoadingBoundary.tsx and AppSuspenseFallback.tsx
export const LOADING_CONSTANTS = {
    MIN_HEIGHT_BOUNDARY: 120, // Minimum height for LoadingBoundary
    MIN_HEIGHT_SUSPENSE: 200, // Minimum height for AppSuspenseFallback
} as const;


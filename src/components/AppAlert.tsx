/**
 * @fileoverview AppAlert component for displaying notifications
 *
 * A reusable alert component that provides consistent styling and behavior
 * for displaying messages with different severity levels (error, success, warning, info).
 * It supports an optional title and a close button.
 *
 * @author MetaText Development Team
 * @version 1.0.0
 * @since 2025-07-10
 */
import { Alert, AlertTitle, Collapse } from '@mui/material';
import type { ReactElement, ReactNode } from 'react';

export interface AppAlertProps {
    /** The severity of the alert. This defines the color and icon. */
    severity: 'error' | 'success' | 'warning' | 'info';
    /** The main content of the alert. */
    children: ReactNode;
    /** An optional title for the alert. */
    title?: string;
    /** An optional callback to be called when the alert is closed. If provided, a close button is displayed. */
    onClose?: () => void;
}

/**
 * AppAlert Component
 *
 * A standardized alert component for displaying notifications across the application.
 * It ensures consistent styling, including margins, and supports various severity levels.
 *
 * @param props - Component props
 * @returns {ReactElement | null} The alert component, or null if children is not provided.
 *
 * @example
 * ```tsx
 * // Error alert
 * <AppAlert severity="error">This is an error message.</AppAlert>
 *
 * // Success alert with a title and close button
 * <AppAlert severity="success" title="Success" onClose={() => console.log('closed')}>
 *   Operation completed successfully.
 * </AppAlert>
 * ```
 */
export function AppAlert({ severity, children, title, onClose }: AppAlertProps): ReactElement {
    return (
        <Collapse in={!!children}>
            <Alert severity={severity} sx={{ mb: 2 }} onClose={onClose}>
                {title && <AlertTitle>{title}</AlertTitle>}
                {children}
            </Alert>
        </Collapse>
    );
}

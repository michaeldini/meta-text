/**
 * @fileoverview ErrorAlert component for MetaText Review
 * 
 * A standardized error alert component for displaying error messages to users.
 * Provides consistent error UI throughout the MetaText Review page.
 * 
 * @author MetaText Development Team
 * @version 1.0.0
 * @since 2025-07-09
 */

import { Alert } from '@mui/material';
import type { ReactElement } from 'react';

/**
 * ErrorAlert Component Props
 */
interface ErrorAlertProps {
    /** The error message to display */
    message: string;
}

/**
 * ErrorAlert Component
 * 
 * A standardized error alert component for displaying error messages to users.
 * Provides consistent error UI throughout the review page.
 * 
 * @param props - Component props
 * @param props.message - The error message to display
 * @returns {ReactElement} The error alert component
 * 
 * @example
 * ```tsx
 * <ErrorAlert message="Failed to load data" />
 * ```
 */
export function ErrorAlert({ message }: ErrorAlertProps): ReactElement {
    return <Alert severity="error">{message}</Alert>;
}

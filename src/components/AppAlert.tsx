
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
 * AppAlert component displays an alert message with a title and optional close button.
 * It uses MUI's Alert component for consistent styling and behavior.
 */
export function AppAlert(props: AppAlertProps): ReactElement {
    const { severity, children, title, onClose } = props;
    return (
        <Collapse in={!!children}>
            <Alert severity={severity} sx={{ mb: 2 }} onClose={onClose}>
                {title && <AlertTitle>{title}</AlertTitle>}
                {children}
            </Alert>
        </Collapse>
    );
}

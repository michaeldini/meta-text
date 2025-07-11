
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

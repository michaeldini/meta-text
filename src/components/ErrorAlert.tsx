// ErrorAlert
// Implements local dismiss logic or delegates to provided onClose handler.
import * as React from 'react';
import { useState, useEffect } from 'react';
import { AlertRoot, AlertIndicator, AlertContent, AlertTitle, AlertDescription, AlertDismissButton } from '@styles';

export interface ErrorAlertProps {
    message: React.ReactNode;
    title?: React.ReactNode;
    onClose?: () => void; // Optional external close handler (e.g. clear error in store)
    ['data-testid']?: string;
    mt?: string | number;
    mb?: string | number;
}

export function ErrorAlert({
    message,
    title = 'Error',
    onClose,
    'data-testid': dataTestId,
    mt,
    mb,
}: ErrorAlertProps) {
    const [dismissed, setDismissed] = useState(false);

    // Reset local dismissed state whenever message changes
    useEffect(() => { setDismissed(false); }, [message]);

    if (!message || dismissed) return null;

    const handleClose = () => {
        if (onClose) onClose(); else setDismissed(true);
    };
    return (
        <AlertRoot data-testid={dataTestId} role="alert" style={{ marginTop: mt as any, marginBottom: mb as any }}>
            <AlertIndicator />
            <AlertContent>
                <AlertTitle>{title}</AlertTitle>
                <AlertDescription>{message}</AlertDescription>
            </AlertContent>
            <AlertDismissButton aria-label="Dismiss error" onClick={handleClose}>&times;</AlertDismissButton>
        </AlertRoot>
    );
}

export default ErrorAlert;

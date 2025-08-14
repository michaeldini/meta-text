// ErrorAlert
// Reusable dismissible error alert using Chakra UI v3 composed API (Alert.Root, Indicator, Content, Title, Description).
// Implements local dismiss logic or delegates to provided onClose handler.
import React, { useState, useEffect } from 'react';
import { CloseButton } from '@chakra-ui/react/button';
import { Alert } from '@chakra-ui/react/alert';

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
        <Alert.Root
            status="error"
            variant="subtle"
            borderRadius="md"
            mt={mt}
            mb={mb}
            data-testid={dataTestId}
            role="alert"
        >
            <Alert.Indicator />
            <Alert.Content>
                <Alert.Title>{title}</Alert.Title>
                <Alert.Description>{message}</Alert.Description>
            </Alert.Content>
            <CloseButton
                size="lg"
                pos="relative"
                top="-2"
                insetEnd="-2"
                color="primary"
                aria-label="Dismiss error"
                onClick={handleClose}
            />
        </Alert.Root>
    );
}

export default ErrorAlert;

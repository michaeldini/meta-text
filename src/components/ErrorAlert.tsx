// ErrorAlert
// Implements local dismiss logic or delegates to provided onClose handler.
import * as React from 'react';
import { useState, useEffect } from 'react';
import { Box, Heading, Text, Row } from '@styles';
import { HiXCircle } from 'react-icons/hi2';

export interface ErrorAlertProps {
    message: React.ReactNode;
    title?: React.ReactNode;
    onClose?: () => void; // Optional external close handler (e.g. clear error in store)
    ['data-testid']?: string;
}

export function ErrorAlert({
    message,
    title = 'Error',
    onClose,
    'data-testid': dataTestId,
}: ErrorAlertProps) {
    const [dismissed, setDismissed] = useState(false);

    // Reset local dismissed state whenever message changes
    useEffect(() => { setDismissed(false); }, [message]);

    if (!message || dismissed) return null;

    const handleClose = () => {
        if (onClose) onClose(); else setDismissed(true);
    };
    return (
        <Row variant="danger" data-testid={dataTestId} role="alert">
            <Box>
                <Heading tone="danger">{title}</Heading>
                <Text>{message}</Text>
            </Box>
            <HiXCircle style={{ flex: '0 0 auto', fontSize: '1.5rem' }} onClick={handleClose} />
        </Row>
    );
}

export default ErrorAlert;

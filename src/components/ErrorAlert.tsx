// ErrorAlert
// Implements local dismiss logic or delegates to provided onClose handler.
import * as React from 'react';
import { useState, useEffect } from 'react';
import { Heading, Text, Row, IconWrapper, Column, styled } from '@styles';
import { HiXCircle } from 'react-icons/hi2';

const ErrorRow = styled(Row, {
    backgroundColor: '$colors$dangerBg',
    border: '2px solid $colors$dangerBorder',
    alignItems: 'center',
    display: 'flex',
    position: 'fixed' as const,
    top: '0' as const,
    left: '50%' as const,
    right: '50%' as const,
    marginLeft: '-50vw' as const,
    marginRight: '-50vw' as const,
    width: '100vw' as const,
    borderRadius: 0,
    paddingLeft: '1rem',
    paddingRight: '1rem',
}
)

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
        <ErrorRow data-testid={dataTestId} role="alert">
            <Column p="1" css={{ flex: 1 }}>
                <Heading tone="danger">{title}</Heading>
                <Text tone="danger">{message}</Text>
            </Column>
            <IconWrapper css={{ color: 'black', cursor: 'pointer' }}>
                <HiXCircle onClick={handleClose} />
            </IconWrapper>
        </ErrorRow>
    );
}

export default ErrorAlert;

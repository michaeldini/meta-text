// Generic Alert component with variants and optional auto-dismiss
// - Accessible roles (alert/status) and aria-live regions
// - Variants: success, error, info, warning
// - Placement: inline or global (fixed top)
// - Local dismiss logic or delegate via onClose
import * as React from 'react';
import { useState, useEffect, useMemo } from 'react';
import { Heading, Text, Row, IconWrapper, Column, styled, Box } from '@styles';
import { HiXCircle, HiCheckCircle, HiExclamationTriangle, HiInformationCircle } from 'react-icons/hi2';

export type AlertType = 'success' | 'error' | 'info' | 'warning';
export type AlertPlacement = 'inline' | 'global';

const AlertRow = styled(Row, {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: '1rem',
    paddingRight: '1rem',
    paddingTop: '0.5rem',
    paddingBottom: '0.5rem',
    borderRadius: '8px',
    border: '2px solid',

    variants: {
        type: {
            success: {
                backgroundColor: '$colors$successBg',
                borderColor: '$colors$successBorder',
            },
            error: {
                backgroundColor: '$colors$dangerBg',
                borderColor: '$colors$dangerBorder',
            },
            info: {
                backgroundColor: '$colors$infoBg',
                borderColor: '$colors$infoBorder',
            },
            warning: {
                backgroundColor: '$colors$warningBg',
                borderColor: '$colors$warningBorder',
            },
        },
        placement: {
            inline: {
                position: 'relative',
                width: '100%',
            },
            global: {
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                width: '100vw',
                borderRadius: 0,
                zIndex: 9999,
            },
        },
    },

    defaultVariants: {
        type: 'info',
        placement: 'inline',
    },
});

const defaultTitleByType: Record<AlertType, string> = {
    success: 'Success',
    error: 'Error',
    info: 'Info',
    warning: 'Warning',
};

// Map to the limited tones supported by Heading/Text components in our design system
// Heading supports: 'default' | 'danger'
// Text supports: 'subtle' | 'default' | 'danger'
const headingToneByType: Record<AlertType, 'default' | 'danger'> = {
    success: 'default',
    error: 'danger',
    info: 'default',
    warning: 'default',
};

const textToneByType: Record<AlertType, 'subtle' | 'default' | 'danger'> = {
    success: 'default',
    error: 'danger',
    info: 'default',
    warning: 'default',
};

const IconByType: Record<AlertType, React.ComponentType<{ size?: number }>> = {
    success: HiCheckCircle,
    error: HiXCircle,
    info: HiInformationCircle,
    warning: HiExclamationTriangle,
};

const defaultDurationByType: Record<AlertType, number> = {
    success: 3000,
    info: 3000,
    warning: 5000,
    error: 0, // errors default to sticky unless specified
};

export interface AlertProps {
    type?: AlertType;
    title?: React.ReactNode;
    message?: React.ReactNode;
    onClose?: () => void; // Optional external close handler (e.g., store removal)
    autoDismiss?: boolean | number; // true uses default by type; number overrides (ms)
    placement?: AlertPlacement; // inline vs global (fixed)
    ['data-testid']?: string;
}

export function Alert({
    type = 'info',
    title,
    message,
    onClose,
    autoDismiss = false,
    placement = 'inline',
    'data-testid': dataTestId,
}: AlertProps) {
    const [dismissed, setDismissed] = useState(false);

    // Reset local dismissed state whenever message or type changes
    useEffect(() => { setDismissed(false); }, [message, type]);

    const effectiveTitle = title ?? defaultTitleByType[type];
    const headingTone = headingToneByType[type];
    const textTone = textToneByType[type];
    const LeadingIcon = IconByType[type];

    const computedDuration = useMemo(() => {
        if (typeof autoDismiss === 'number') return autoDismiss;
        if (autoDismiss) return defaultDurationByType[type];
        return 0;
    }, [autoDismiss, type]);

    // Auto-dismiss when configured with a duration > 0
    useEffect(() => {
        if (!message) return;
        if (computedDuration && computedDuration > 0) {
            const t = setTimeout(() => {
                if (onClose) onClose(); else setDismissed(true);
            }, computedDuration);
            return () => clearTimeout(t);
        }
    }, [computedDuration, message, onClose]);

    if (!message || dismissed) return null;

    // Accessibility roles: errors/warnings are assertive, info/success are polite
    const role = type === 'error' || type === 'warning' ? 'alert' : 'status';
    const ariaLive = type === 'error' || type === 'warning' ? 'assertive' : 'polite';

    const handleClose = () => {
        if (onClose) onClose(); else setDismissed(true);
    };

    return (
        <AlertRow data-testid={dataTestId} type={type} placement={placement} role={role} aria-live={ariaLive}>
            <IconWrapper css={{ marginRight: '8px', color: 'black' }} aria-hidden>
                <LeadingIcon />
            </IconWrapper>
            <Column p="1" css={{ flex: 1 }}>
                {effectiveTitle && <Heading tone={headingTone}>{effectiveTitle}</Heading>}
                {message && <Text tone={textTone}>{message}</Text>}
            </Column>
            <Box as="button" aria-label="Dismiss alert" onClick={handleClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                <IconWrapper css={{ color: 'black' }}>
                    <HiXCircle />
                </IconWrapper>
            </Box>
        </AlertRow>
    );
}

export default Alert;

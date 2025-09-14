import React from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';
import { styled, Button, keyframes } from '@styles';

// Define styled pieces at module scope to avoid recreating them on each render.
const IconWrapper = styled('span', {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5em',
});

const tooltipFade = keyframes({
    '0%': { opacity: 0, transform: 'translateY(4px)' },
    '100%': { opacity: 1, transform: 'translateY(0)' },
});

const TooltipContent = styled(Tooltip.Content, {
    background: '$colors$tooltipBg',
    color: '$colors$primary',
    padding: '8px 10px',
    border: '2px solid $colors$primary',
    borderRadius: '6px',
    fontSize: '1.1rem',
    boxShadow: '0 6px 18px rgba(0,0,0,0.18)',
    animation: `${tooltipFade} 160ms ease`,
    zIndex: 1000,
});

export interface TooltipButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'color' | 'size'> {
    label: string;
    icon?: React.ReactNode;
    tooltip?: string;
    disabled?: boolean;
    onClick?: (() => void) | ((event: React.MouseEvent<HTMLButtonElement>) => void);
    onKeyDown?: (event: React.KeyboardEvent) => void;
    color?: string;
    role?: string;
    type?: 'button' | 'submit' | 'reset';
    side?: 'top' | 'right' | 'bottom' | 'left';
    tone?: 'default' | 'primary' | 'danger';
    loading?: boolean;
    iconSize?: string | number;
}

export function TooltipButton({
    label,
    tooltip,
    icon,
    disabled = false,
    onClick,
    onKeyDown,
    type = 'button',
    color = 'inherit',
    side = 'top',
    tone = 'default',
    role = 'button',
    loading = false,
    iconSize,
    ...rest
}: TooltipButtonProps): React.ReactElement {

    // Re-usable components (defined at module scope) are used here to avoid
    // recreating styled components on every render which can cause DOM
    // remounts and unexpected focus changes.
    // map tone fallback for inline style color prop
    const toneProp = (tone as any) || 'default';

    return (
        <Tooltip.Provider>
            <Tooltip.Root>
                <Tooltip.Trigger asChild>
                    <Button
                        onClick={onClick}
                        disabled={disabled}
                        aria-label={label}
                        type={type}
                        onKeyDown={onKeyDown}
                        role={role}
                        tone={toneProp}
                        {...rest}
                        style={{ ...(rest.style || {}) }}
                    >
                        {icon ? <IconWrapper style={{ fontSize: iconSize as any }}>{icon}</IconWrapper> : null}

                        {loading ? '…' : label}
                    </Button>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                    <TooltipContent side={side} sideOffset={10}>
                        {tooltip || label}
                    </TooltipContent>
                </Tooltip.Portal>
            </Tooltip.Root>
        </Tooltip.Provider >
    );
}

export default TooltipButton;

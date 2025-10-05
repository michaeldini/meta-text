import React from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';
import { styled, Button, IconWrapper, keyframes, Text } from '@styles';


const tooltipFade = keyframes({
    '0%': { opacity: 0, transform: 'translateY(4px)' },
    '100%': { opacity: 1, transform: 'translateY(0)' },
});

const TooltipContent = styled(Tooltip.Content, {
    background: '$colors$altBackground',
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
    type = 'button',
    side = 'top',
    tone = 'default',
    role = 'button',
    loading = false,
    iconSize,
}: TooltipButtonProps): React.ReactElement {


    return (
        <Tooltip.Provider>
            <Tooltip.Root>
                <Tooltip.Trigger asChild>
                    <Button
                        onClick={onClick}
                        disabled={disabled}
                        aria-label={label}
                        type={type}
                        role={role}
                        tone={tone}
                    >
                        {icon ? <IconWrapper style={{ fontSize: iconSize as React.CSSProperties['fontSize'] }}>{icon}</IconWrapper> : null}

                        <Text>{loading ? '…' : label}</Text>
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

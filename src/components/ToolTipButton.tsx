import React from 'react';
import { Button } from '@chakra-ui/react/button';
import { Tooltip } from 'components';

// Generic button with tooltip for consistent UI usage. Accepts label, icon, onClick, disabled.
export interface TooltipButtonProps {
    label: string;
    icon?: React.ReactNode;
    tooltip?: string;
    disabled?: boolean;
    onClick?: (() => void) | ((event: React.MouseEvent<HTMLButtonElement>) => void);
    onKeyDown?: (event: React.KeyboardEvent) => void;
    type?: 'button' | 'submit' | 'reset';
    color?: string;
    size?: 'sm' | "md" | "lg" | "xl" | "2xl" | "2xs" | "xs";
    role?: string;
    [key: string]: any; // Allow additional props for flexibility
}

export function TooltipButton({
    label,
    tooltip,
    icon,
    disabled = false,
    onClick,
    onKeyDown,
    type = 'button',
    color = 'primary',
    size = 'lg',
    role = 'button',
    ...rest
}: TooltipButtonProps): React.ReactElement {
    return (
        <Tooltip content={tooltip || label}>
            <Button
                color={color}
                size={size}
                onClick={onClick}
                disabled={disabled}
                aria-label={label}
                type={type}
                onKeyDown={onKeyDown}
                role={role}
                {...rest}
            >
                {icon && <span style={{ display: 'inline-flex', alignItems: 'center', marginRight: icon ? 6 : 0 }}>{icon}</span>}
                {label}
            </Button>
        </Tooltip>
    );
}

export default TooltipButton;

import React from 'react';
import { Button } from '@chakra-ui/react/button';
import { Tooltip } from '@components/ui/tooltip';
import { Icon } from '@chakra-ui/react/icon';

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
    iconSize?: 'sm' | "md" | "lg" | "xl" | "2xl" | "xs";
    positioning?: any;
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
    color = 'fg',
    size = 'lg',
    role = 'button',
    iconSize = 'lg',
    positioning = { placement: "left-end" },
    ...rest
}: TooltipButtonProps): React.ReactElement {
    return (
        <Tooltip
            content={tooltip || label}
            positioning={positioning}
        >
            <Button
                // bg="bg.emphasized"
                // variant="ghost"
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
                {icon && (
                    <Icon size={iconSize}>
                        {icon}
                    </Icon>
                )}
                {label}
            </Button>
        </Tooltip>
    );
}

export default TooltipButton;

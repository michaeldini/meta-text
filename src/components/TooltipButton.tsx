import React from 'react';
import { Button } from '@chakra-ui/react/button';
import { Tooltip, type TooltipProps } from '@components/ui/tooltip';
import { Icon } from '@chakra-ui/react/icon';
import type { ButtonProps } from '@chakra-ui/react/button';
// import type { Placement } from '@chakra-ui/react/popper';

// Generic button with tooltip for consistent UI usage. Accepts label, icon, onClick, disabled.
export interface TooltipButtonProps extends Omit<ButtonProps, 'aria-label' | 'size' | 'color'> {
    label: string;
    icon?: React.ReactNode;
    tooltip?: string;
    disabled?: boolean;
    onClick?: (() => void) | ((event: React.MouseEvent<HTMLButtonElement>) => void);
    onKeyDown?: (event: React.KeyboardEvent) => void;
    type?: 'button' | 'submit' | 'reset';
    color?: string;
    size?: ButtonProps['size'];
    role?: string;
    positioning?: TooltipProps['positioning'];
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
                    icon

                )}
                {label}
            </Button>
        </Tooltip>
    );
}

export default TooltipButton;

import React from 'react';
import { Button } from '@chakra-ui/react';
import { Tooltip } from 'components';

// Generic button with tooltip for consistent UI usage. Accepts label, icon, onClick, disabled.
export interface ToolTipButtonProps {
    label: string;
    icon?: React.ReactNode;
    toolTip?: string;
    disabled?: boolean;
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
    color?: string;
    size?: 'sm' | "md" | "lg" | "xl" | "2xl" | "2xs" | "xs";
}

export function ToolTipButton({
    label,
    icon,
    toolTip,
    disabled = false,
    onClick,
    type = 'button',
    color = 'primary',
    size = 'lg',
    ...rest
}: ToolTipButtonProps): React.ReactElement {
    return (
        <Tooltip content={toolTip || label}>
            <Button
                color={color}
                size={size}
                onClick={onClick}
                disabled={disabled}
                aria-label={label}
                type={type}
                {...rest}
            >
                {icon && <span style={{ display: 'inline-flex', alignItems: 'center', marginRight: icon ? 6 : 0 }}>{icon}</span>}
                {label}
            </Button>
        </Tooltip>
    );
}

export default ToolTipButton;

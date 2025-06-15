import React from 'react';
import { IconButton, Tooltip, IconButtonProps } from '@mui/material';

export interface ToolIconButtonProps extends Omit<IconButtonProps, 'color' | 'onClick'> {
    title: string;
    icon?: React.ReactNode;
    ariaLabel: string;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    color?: IconButtonProps['color'];
    sx?: object;
    disabled?: boolean;
    children?: React.ReactNode;
}

const ToolIconButton: React.FC<ToolIconButtonProps> = ({
    title,
    icon,
    ariaLabel,
    onClick,
    color = 'default',
    sx,
    disabled = false,
    children,
    ...props
}) => (
    <Tooltip title={title}>
        <span>
            <IconButton
                color={color}
                aria-label={ariaLabel}
                onClick={onClick}
                sx={sx}
                disabled={disabled}
                {...props}
            >
                {icon || children}
            </IconButton>
        </span>
    </Tooltip>
);

export default ToolIconButton;

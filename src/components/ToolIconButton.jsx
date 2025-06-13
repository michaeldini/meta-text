import React from 'react';
import { IconButton, Tooltip } from '@mui/material';

/**
 * ToolIconButton - Combines Tooltip and IconButton for consistent UI.
 * @param {string} title - Tooltip text
 * @param {React.ReactNode} icon - Icon to display inside the button
 * @param {string} ariaLabel - aria-label for accessibility
 * @param {function} onClick - Click handler
 * @param {string} color - IconButton color
 * @param {object} sx - Style overrides
 * @param {boolean} disabled - Disabled state
 * @param {React.ReactNode} children - Optional children (icon can be passed as children)
 */
const ToolIconButton = ({
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

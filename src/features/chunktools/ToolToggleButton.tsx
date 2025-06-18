import React from 'react';
import { ToggleButton, Typography, Tooltip } from '@mui/material';

interface ToolToggleButtonProps {
    value: string;
    ariaLabel: string;
    tooltip: string;
    icon?: React.ReactNode;
    children?: React.ReactNode;
}

const ToolToggleButton: React.FC<ToolToggleButtonProps> = ({ value, ariaLabel, tooltip, icon, children }) => (
    <Tooltip
        title={<Typography sx={{ fontSize: 16 }}>{tooltip}</Typography>}
        arrow
        enterDelay={200}
    >
        <ToggleButton value={value} aria-label={ariaLabel}>
            {icon}
            {children}
        </ToggleButton>
    </Tooltip>
);

export default ToolToggleButton;

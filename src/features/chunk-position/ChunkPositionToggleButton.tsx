
// Toggle component for showing/hiding chunk positions
// Placed next to BookmarkNavigateButton in MetatextDetailPage

import React from 'react';
import { IconButton, Tooltip } from '@mui/material';

import { TicketIcon } from 'icons'; // Using TicketIcon as placeholder


interface ChunkPositionToggleButtonProps {
    value: boolean;
    onChange: (val: boolean) => void;
    disabled?: boolean;
}


export function ChunkPositionToggleButton(props: ChunkPositionToggleButtonProps) {
    const { value: checked, onChange, disabled } = props;
    return (
        <Tooltip title={checked ? "Hide chunk positions" : "Show chunk positions"} arrow>
            <span style={{ display: 'inline-flex' }}>
                <IconButton
                    onClick={() => onChange(!checked)}
                    color={checked ? "primary" : "default"}
                    data-testid="chunk-position-toggle"
                    disabled={disabled}
                >
                    <TicketIcon />
                </IconButton>
            </span>
        </Tooltip>
    );
}

export default ChunkPositionToggleButton;

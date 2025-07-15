// Toggle component for showing/hiding chunk positions
// Similar pattern to other StyleControls components

import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { useUIPreferencesStore } from 'store';
import { TicketIcon } from 'icons'; // Using TicketIcon as placeholder

const ChunkPositionToggle: React.FC = () => {
    const { showChunkPositions, setShowChunkPositions } = useUIPreferencesStore();

    return (
        <Tooltip title={showChunkPositions ? "Hide chunk positions" : "Show chunk positions"} arrow>
            <IconButton
                onClick={() => setShowChunkPositions(!showChunkPositions)}
                color={showChunkPositions ? "primary" : "default"}
                data-testid="chunk-position-toggle"
            >
                <TicketIcon />
            </IconButton>
        </Tooltip>
    );
};

export default ChunkPositionToggle;

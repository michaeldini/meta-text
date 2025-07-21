// Toggle component for showing/hiding chunk positions
// Similar pattern to other StyleControls components

import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { useUIPreferences, useUpdateUIPreferences } from 'store/uiPreferences';
import { TicketIcon } from 'icons'; // Using TicketIcon as placeholder

const ChunkPositionToggle: React.FC = () => {
    const { showChunkPositions } = useUIPreferences();
    const updateUIPreferences = useUpdateUIPreferences();

    return (
        <Tooltip title={showChunkPositions ? "Hide chunk positions" : "Show chunk positions"} arrow>
            <IconButton
                onClick={() => updateUIPreferences.mutate({ showChunkPositions: !showChunkPositions })}
                color={showChunkPositions ? "primary" : "default"}
                data-testid="chunk-position-toggle"
                disabled={updateUIPreferences.status === 'pending'}
            >
                <TicketIcon />
            </IconButton>
        </Tooltip>
    );
};

export default ChunkPositionToggle;

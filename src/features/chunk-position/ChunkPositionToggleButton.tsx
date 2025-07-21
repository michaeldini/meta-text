// Toggle component for showing/hiding chunk positions
// Placed next to BookmarkNavigateButton in MetatextDetailPage

import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { useUIPreferences, useUpdateUIPreferences } from 'store/uiPreferences';
import { TicketIcon } from 'icons'; // Using TicketIcon as placeholder

const ChunkPositionToggleButton: React.FC = () => {
    const { showChunkPositions } = useUIPreferences();
    const updateUIPreferences = useUpdateUIPreferences();

    return (
        <Tooltip title={showChunkPositions ? "Hide chunk positions" : "Show chunk positions"} arrow>
            <span style={{ display: 'inline-flex' }}>
                <IconButton
                    onClick={() => updateUIPreferences.mutate({ showChunkPositions: !showChunkPositions })}
                    color={showChunkPositions ? "primary" : "default"}
                    data-testid="chunk-position-toggle"
                    disabled={updateUIPreferences.status === 'pending'}
                >
                    <TicketIcon />
                </IconButton>
            </span>
        </Tooltip>
    );
};

export default ChunkPositionToggleButton;

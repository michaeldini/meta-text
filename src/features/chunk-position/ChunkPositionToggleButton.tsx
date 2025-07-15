// Toggle component for showing/hiding chunk positions
// Placed next to BookmarkNavigateButton in MetatextDetailPage

import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { useUIPreferencesStore } from 'store';
import { TicketIcon } from 'icons'; // Using TicketIcon as placeholder

const ChunkPositionToggleButton: React.FC = () => {
    const { showChunkPositions, setShowChunkPositions } = useUIPreferencesStore();

    return (
        <Tooltip title={showChunkPositions ? "Hide chunk positions" : "Show chunk positions"} arrow>
            <span style={{ display: 'inline-flex' }}>
                <IconButton
                    onClick={() => setShowChunkPositions(!showChunkPositions)}
                    color={showChunkPositions ? "primary" : "default"}
                    data-testid="chunk-position-toggle"
                >
                    <TicketIcon />
                </IconButton>
            </span>
        </Tooltip>
    );
};

export default ChunkPositionToggleButton;

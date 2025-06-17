import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useChunkStore } from '../store/chunkStore';

const ChunkToolsNavbar: React.FC = () => {
    const { activeChunkId } = useChunkStore();

    // Example action handler
    const handleShowDialog = () => {
        if (!activeChunkId) return;
        // Open dialog logic for the active chunk
        alert(`Open dialog for chunk: ${activeChunkId}`);
    };

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1, bgcolor: 'background.paper', borderRadius: 1, boxShadow: 1 }}>
            <Typography variant="subtitle1">
                {activeChunkId ? `Active Chunk: ${activeChunkId}` : 'No chunk selected'}
            </Typography>
            <Button variant="contained" color="primary" onClick={handleShowDialog} disabled={!activeChunkId}>
                Open Actions
            </Button>
            {/* Add more tool buttons here, acting on activeChunkId */}
        </Box>
    );
};

export default ChunkToolsNavbar;

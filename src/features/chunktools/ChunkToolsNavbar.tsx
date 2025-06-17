import React from 'react';
import { Box, Typography, Button, ToggleButton, ToggleButtonGroup } from '@mui/material';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import PhotoFilterIcon from '@mui/icons-material/PhotoFilter';
import { useChunkStore } from '../../store/chunkStore';



const ChunkToolsNavbar: React.FC = () => {
    const activeChunkId = useChunkStore(state => state.activeChunkId);
    const activeTab = useChunkStore(state => state.activeTab);
    const setActiveTab = useChunkStore(state => state.setActiveTab);

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
            <ToggleButtonGroup
                value={activeTab}
                exclusive
                onChange={(_, tab) => tab && setActiveTab(tab)}
                size="small"
                sx={{ ml: 2 }}
            >
                <ToggleButton value="comparison" aria-label="Show Comparison">
                    <CompareArrowsIcon sx={{ mr: 1 }} /> Comparison
                </ToggleButton>
                <ToggleButton value="ai-image" aria-label="Show AI Image">
                    <PhotoFilterIcon sx={{ mr: 1 }} /> AI Image
                </ToggleButton>
            </ToggleButtonGroup>
            {/* Add more tool buttons here, acting on activeChunkId */}
        </Box>
    );
};

export default ChunkToolsNavbar;

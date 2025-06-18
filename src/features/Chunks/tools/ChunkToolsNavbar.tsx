import React from 'react';
import { Box, Typography, Button, ToggleButtonGroup, ToggleButton, Tooltip, Typography as MuiTypography } from '@mui/material';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import PhotoFilterIcon from '@mui/icons-material/PhotoFilter';
import NotesIcon from '@mui/icons-material/Notes';
import { useChunkStore } from '../../../store/chunkStore';



const ChunkToolsNavbar: React.FC = () => {
    const activeChunkId = useChunkStore(state => state.activeChunkId);
    const activeTabs = useChunkStore(state => state.activeTabs);
    const setActiveTabs = useChunkStore(state => state.setActiveTabs);

    // Example action handler
    const handleShowDialog = () => {
        if (!activeChunkId) return;
        // Open dialog logic for the active chunk
        alert(`Open dialog for chunk: ${activeChunkId}`);
    };

    // Allow multiple selection
    const handleTabsChange = (_: any, tabs: Array<'comparison' | 'ai-image' | 'notes-summary'>) => {
        setActiveTabs(tabs);
    };

    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }} data-testid="chunk-tools-navbar">
            <Typography variant="subtitle1">
                {activeChunkId ? `Active: ${activeChunkId}` : 'No chunk selected'}
            </Typography>
            <Button onClick={handleShowDialog} disabled={!activeChunkId}>
                Dialogue
            </Button>
            <ToggleButtonGroup
                value={activeTabs}
                onChange={handleTabsChange}
                size="small"
                sx={{ ml: 2 }}
            >
                <Tooltip
                    title={<MuiTypography sx={{ fontSize: 16 }}>Show or hide the Notes/Summary editor for all chunks</MuiTypography>}
                    arrow
                    enterDelay={200}
                >
                    <ToggleButton value="notes-summary" aria-label="Show Notes/Summary">
                        <NotesIcon sx={{ mr: 1 }} />
                    </ToggleButton>
                </Tooltip>
                <Tooltip
                    title={<MuiTypography sx={{ fontSize: 16 }}>Show or hide the AI-generated comparison panel for all chunks</MuiTypography>}
                    arrow
                    enterDelay={200}
                >
                    <ToggleButton value="comparison" aria-label="Show Comparison">
                        <CompareArrowsIcon sx={{ mr: 1 }} />
                    </ToggleButton>
                </Tooltip>
                <Tooltip
                    title={<MuiTypography sx={{ fontSize: 16 }}>Show or hide the AI image panel for all chunks</MuiTypography>}
                    arrow
                    enterDelay={200}
                >
                    <ToggleButton value="ai-image" aria-label="Show AI Image">
                        <PhotoFilterIcon sx={{ mr: 1 }} />
                    </ToggleButton>
                </Tooltip>
            </ToggleButtonGroup>
            {/* Add more tool buttons here, acting on activeChunkId */}
        </Box>
    );
};

export default ChunkToolsNavbar;

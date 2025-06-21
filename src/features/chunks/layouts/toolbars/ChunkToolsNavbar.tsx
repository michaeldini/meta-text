import React from 'react';
import { Box, Typography, Button, ToggleButtonGroup, ToggleButton, Tooltip, Typography as MuiTypography } from '@mui/material';
import { CompareArrowsIcon, PhotoFilterIcon, NotesIcon } from '../../../../components/icons';
import { useChunkStore } from '../../../../store/chunkStore';

interface ChunkToolsNavbarProps {
    /** Whether this component is rendered as a floating element */
    isFloating?: boolean;
    /** Additional CSS class name */
    className?: string;
    /** Test ID for testing */
    'data-testid'?: string;
}

const ChunkToolsNavbar: React.FC<ChunkToolsNavbarProps> = ({
    isFloating = false,
    className,
    'data-testid': dataTestId = 'chunk-tools-navbar'
}) => {
    const activeChunkId = useChunkStore(state => state.activeChunkId);
    const activeTabs = useChunkStore(state => state.activeTabs);
    const setActiveTabs = useChunkStore(state => state.setActiveTabs);

    if (!activeChunkId) return null;

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

    const containerSx = isFloating
        ? {
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            // backgroundColor: 'background.paper',
            borderRadius: 2,
            padding: 0,
            margin: 0,
        }
        : {
            display: 'flex',
            alignItems: 'center'
        };

    return (
        <Box
            sx={containerSx}
            data-testid={dataTestId}
            className={className}
        >

            {!isFloating && (
                <Typography variant="subtitle1">
                    {`Active: ${activeChunkId}`}
                </Typography>
            )}
            {!isFloating && (
                <Button onClick={handleShowDialog} disabled={!activeChunkId}>
                    Dialogue
                </Button>
            )}
            <ToggleButtonGroup
                value={activeTabs}
                onChange={handleTabsChange}
                size="small"
                orientation={isFloating ? 'vertical' : 'horizontal'}
                sx={isFloating ? {} : { ml: 2 }}
            >
                <Tooltip
                    title={<MuiTypography sx={{ fontSize: 16 }}>Show or hide the Notes/Summary editor for all chunks</MuiTypography>}
                    arrow
                    enterDelay={200}
                    placement={isFloating ? 'left' : 'top'}
                >
                    <ToggleButton value="notes-summary" aria-label="Show Notes/Summary">
                        <NotesIcon style={isFloating ? { width: 24, height: 24, color: 'currentColor' } : { marginRight: 8 }} />
                    </ToggleButton>
                </Tooltip>
                <Tooltip
                    title={<MuiTypography sx={{ fontSize: 16 }}>Show or hide the AI-generated comparison panel for all chunks</MuiTypography>}
                    arrow
                    enterDelay={200}
                    placement={isFloating ? 'left' : 'top'}
                >
                    <ToggleButton value="comparison" aria-label="Show Comparison">
                        <CompareArrowsIcon style={isFloating ? { width: 24, height: 24, color: 'currentColor' } : { marginRight: 8 }} />
                    </ToggleButton>
                </Tooltip>
                <Tooltip
                    title={<MuiTypography sx={{ fontSize: 16 }}>Show or hide the AI image panel for all chunks</MuiTypography>}
                    arrow
                    enterDelay={200}
                    placement={isFloating ? 'left' : 'top'}
                >
                    <ToggleButton value="ai-image" aria-label="Show AI Image">
                        <PhotoFilterIcon style={isFloating ? { width: 24, height: 24, color: 'currentColor' } : { marginRight: 8 }} />
                    </ToggleButton>
                </Tooltip>
            </ToggleButtonGroup>
            {/* {isFloating && (
                <Button
                    onClick={handleShowDialog}
                    disabled={!activeChunkId}
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: '0.75rem', m: 0, p: 0 }}
                >
                    Test
                </Button>
            )} */}
        </Box>
    );
};

export default ChunkToolsNavbar;

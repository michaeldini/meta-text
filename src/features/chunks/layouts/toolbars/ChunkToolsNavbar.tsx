import React from 'react';
import { Box, Button, ToggleButtonGroup, ToggleButton, Tooltip, Typography } from '@mui/material';
import { CompareArrowsIcon, PhotoFilterIcon, NotesIcon } from '../../../../components/icons';
import { useChunkStore } from '../../../../store/chunkStore';
import CopyTool from '../../tools/copy/CopyTool';

interface ChunkToolsNavbarProps {
    /** Whether this component is rendered as a floating element */
    isFloating?: boolean;
    /** Additional CSS class name */
    className?: string;
    /** Test ID for testing */
    'data-testid'?: string;
}

const ChunkToolsNavbar: React.FC<ChunkToolsNavbarProps> = ({
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

    const containerSx = {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        borderRadius: 2,
        padding: 0,
        margin: 0
    };

    const tooltipProps = {
        arrow: true,
        enterDelay: 200,
        placement: "left" as const
    };

    const tooltipTitles = {
        notesSummary: <Typography variant="caption">
            Show or hide the Notes/Summary editor for all chunks</Typography>,
        comparison: <Typography variant="caption">
            Show or hide the AI-generated comparison panel for all chunks</Typography>,
        aiImage: <Typography variant="caption">
            Show or hide the AI image panel for all chunks</Typography>,
        copyChunk: <Typography variant="caption">
            Copy the active chunk</Typography>
    };

    return (
        <Box
            sx={containerSx}
            data-testid={dataTestId}
            className={className}
        >
            <ToggleButtonGroup
                value={activeTabs}
                onChange={handleTabsChange}
                size="small"
                orientation="vertical"
            >
                <Tooltip
                    title={tooltipTitles.notesSummary}
                    {...tooltipProps}
                >
                    <ToggleButton value="notes-summary" aria-label="Show Notes/Summary">
                        <NotesIcon />
                    </ToggleButton>
                </Tooltip>
                <Tooltip
                    title={tooltipTitles.comparison}
                    {...tooltipProps}
                >
                    <ToggleButton value="comparison" aria-label="Show Comparison">
                        <CompareArrowsIcon />
                    </ToggleButton>
                </Tooltip>
                <Tooltip
                    title={tooltipTitles.aiImage}
                    {...tooltipProps}
                >
                    <ToggleButton value="ai-image" aria-label="Show AI Image">
                        <PhotoFilterIcon />
                    </ToggleButton>
                </Tooltip>
            </ToggleButtonGroup>
            <Tooltip
                title={tooltipTitles.copyChunk}
                {...tooltipProps}
            >
                <CopyTool />
            </Tooltip>
        </Box>
    );
};

export default ChunkToolsNavbar;

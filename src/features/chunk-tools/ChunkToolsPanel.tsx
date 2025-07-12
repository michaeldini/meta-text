// Floating panel for chunk tool visibility (renamed from ChunkToolButtons)
// This component renders a floating panel with toggle buttons for chunk tools
// It allows users to select multiple tools at once and displays them in each chunk

import React from 'react';
import ReactDOM from 'react-dom';
import { useTheme } from '@mui/material/styles';
import { Box, Fade, ToggleButtonGroup, ToggleButton, Tooltip, Typography } from '@mui/material';

import { useChunkStore } from 'store';
import { FADE_IN_DURATION } from 'constants';
import { getChunkComponentsStyles } from '../chunk/Chunk.styles';
import { createChunkToolsRegistry, type ChunkToolId } from './toolsRegistry';

const ChunkToolsPanel: React.FC = () => {
    const theme = useTheme();
    const styles = getChunkComponentsStyles(theme);
    const activeTabs = useChunkStore(state => state.activeTabs);
    const setActiveTabs = useChunkStore(state => state.setActiveTabs);

    // Get tool definitions
    const toolsRegistry = createChunkToolsRegistry();

    // Allow multiple selection
    const handleTabsChange = (_: any, tabs: ChunkToolId[]) => {
        setActiveTabs(tabs);
    };

    const toolbar = (
        <Box
            sx={styles.chunkToolButtonsContainer}
            data-testid="chunk-tools-panel"
        >
            <ToggleButtonGroup
                value={activeTabs}
                onChange={handleTabsChange}
                size="small"
                orientation="vertical"
            >
                {toolsRegistry.map((tool) => (
                    <Tooltip
                        key={tool.id}
                        title={<Typography variant="caption">{tool.tooltip}</Typography>}
                        {...styles.chunkToolButtonsToolTip}
                    >
                        <span>
                            <ToggleButton
                                value={tool.id}
                                aria-label={tool.name}
                                color="secondary"
                            >
                                {tool.icon}
                            </ToggleButton>
                        </span>
                    </Tooltip>
                ))}
            </ToggleButtonGroup>
        </Box>
    );

    // Always render floating toolbar
    const floatingStyles = {
        padding: 0,
        width: '48px',
        position: 'fixed' as const,
        top: '72px',
        right: '15px',
        zIndex: theme.zIndex.speedDial,
        pointerEvents: 'auto',
    };

    const floatingToolbar = (
        <Fade in={true} timeout={FADE_IN_DURATION} style={{ transitionDelay: '100ms' }}>
            <Box sx={floatingStyles}>{toolbar}</Box>
        </Fade>
    );

    return ReactDOM.createPortal(floatingToolbar, document.body);
};

export default ChunkToolsPanel;

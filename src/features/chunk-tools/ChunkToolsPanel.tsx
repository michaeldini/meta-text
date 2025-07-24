// Floating panel for chunk tool visibility (renamed from ChunkToolButtons)
// This component renders a floating panel with toggle buttons for chunk tools
// It allows users to select multiple tools at once and displays them in each chunk

import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Box, ToggleButtonGroup, ToggleButton, Tooltip, Typography, BottomNavigation, Paper } from '@mui/material';

import { useChunkStore } from 'store';
import { FADE_IN_DURATION } from 'constants';
import { getChunkComponentsStyles } from '../chunk/Chunk.styles';
import { createChunkToolsRegistry, type ChunkToolId } from './toolsRegistry';

const ChunkToolsPanel: React.FC = () => {
    // This component renders a fixed bottom navigation bar with toggle buttons for chunk tools
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

    return (
        <Paper sx={{ position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: theme.zIndex.speedDial, borderRadius: 0 }} elevation={3}>
            <Box sx={{ justifyContent: 'center', py: 1, background: 'inherit', display: 'flex' }}>
                <ToggleButtonGroup
                    value={activeTabs}
                    onChange={handleTabsChange}
                    size="small"
                    exclusive={false}
                    sx={{ width: '100%', gap: 0, display: 'flex' }}
                >
                    {toolsRegistry.map((tool) => (
                        <Tooltip
                            key={tool.id}
                            title={<Typography variant="caption">{tool.tooltip}</Typography>}
                            {...styles.chunkToolButtonsToolTip}
                        >
                            <span style={{ width: `100%`, display: 'flex', flex: 1 }}>
                                <ToggleButton
                                    value={tool.id}
                                    aria-label={tool.name}
                                    color="secondary"
                                    sx={{ flex: 1, width: '100%', borderRadius: 0, border: 'none', boxShadow: 'none' }}
                                >
                                    {tool.icon}
                                </ToggleButton>
                            </span>
                        </Tooltip>
                    ))}
                </ToggleButtonGroup>
            </Box>
        </Paper>
    );
};

export default ChunkToolsPanel;

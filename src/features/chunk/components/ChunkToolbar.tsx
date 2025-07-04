import React from 'react';
import ReactDOM from 'react-dom';
import { useTheme } from '@mui/material/styles';
import { Box, Fade, ToggleButtonGroup, ToggleButton, Tooltip, Typography } from '@mui/material';

import { useChunkStore } from 'store';
import { FADE_IN_DURATION } from 'constants';

import CopyTool from '../tools/copy/CopyTool';
import { getChunkToolsStyles } from '../Chunk.styles';
import { toggleButtons, ChunkTab } from './chunkToolbarConfig';


const ChunkToolsNavbar: React.FC = () => {
    const theme = useTheme();
    const styles = getChunkToolsStyles(theme);
    const activeChunkId = useChunkStore(state => state.activeChunkId);
    const activeTabs = useChunkStore(state => state.activeTabs);
    const setActiveTabs = useChunkStore(state => state.setActiveTabs);

    const isDisabled = !activeChunkId;


    // Allow multiple selection
    const handleTabsChange = (_: any, tabs: ChunkTab[]) => {
        setActiveTabs(tabs);
    };

    const toolbar = (
        <Box
            sx={styles.toolsContainer}
            data-testid="chunk-tools-navbar"
        >
            <ToggleButtonGroup
                value={activeTabs}
                onChange={handleTabsChange}
                size="small"
                orientation="vertical"
            // color="secondary"
            >
                {toggleButtons.map((button) => (
                    <Tooltip
                        key={button.value}
                        title={button.tooltipTitle}
                        {...styles.tooltipProps}
                    >
                        <span>
                            <ToggleButton value={button.value} aria-label={button.ariaLabel} disabled={isDisabled} color="secondary">
                                {button.icon}
                            </ToggleButton>
                        </span>
                    </Tooltip>
                ))}
            </ToggleButtonGroup>
            <Box sx={styles.toolButtonsContainer}>
                <CopyTool />
            </Box>
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

export default ChunkToolsNavbar;

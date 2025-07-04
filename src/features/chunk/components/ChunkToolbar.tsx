import React from 'react';
import ReactDOM from 'react-dom';
import { Box, Fade, ToggleButtonGroup, ToggleButton, Tooltip, Typography } from '@mui/material';
import { CompareArrowsIcon, PhotoIcon, NotesIcon, CompressionIcon, QuestionMarkIcon } from 'icons';
import { useChunkStore } from 'store';
import { FADE_IN_DURATION } from 'constants';
import CopyTool from '../tools/copy/CopyTool';
import { getChunkToolsStyles } from '../Chunk.styles';
import { useTheme } from '@mui/material/styles';


const ChunkToolsNavbar: React.FC = () => {
    const theme = useTheme();
    const styles = getChunkToolsStyles(theme);
    const activeChunkId = useChunkStore(state => state.activeChunkId);
    const activeTabs = useChunkStore(state => state.activeTabs);
    const setActiveTabs = useChunkStore(state => state.setActiveTabs);

    const isDisabled = !activeChunkId;


    // Allow multiple selection
    const handleTabsChange = (_: any, tabs: Array<'comparison' | 'ai-image' | 'notes-summary' | 'compression' | 'explanation'>) => {
        setActiveTabs(tabs);
    };

    const toggleButtons = [
        {
            value: 'notes-summary',
            ariaLabel: 'Show Notes/Summary',
            tooltipTitle: <Typography variant="caption">
                Show or hide the Notes/Summary editor for all chunks</Typography>,
            icon: <NotesIcon />
        },
        {
            value: 'comparison',
            ariaLabel: 'Show Comparison',
            tooltipTitle: <Typography variant="caption">
                Show or hide the AI-generated comparison panel for all chunks</Typography>,
            icon: <CompareArrowsIcon />
        },
        {
            value: 'ai-image',
            ariaLabel: 'Show AI Image',
            tooltipTitle: <Typography variant="caption">
                Show or hide the AI image panel for all chunks</Typography>,
            icon: <PhotoIcon />
        },
        {
            value: 'compression',
            ariaLabel: 'Compress Chunk',
            tooltipTitle: <Typography variant="caption">
                Show or hide the compressions for all chunks</Typography>,
            icon: <CompressionIcon />
        },
        {
            value: 'explanation',
            ariaLabel: 'Show Explanation',
            tooltipTitle: <Typography variant="caption">
                Show or hide the explanation editor for all chunks</Typography>,
            icon: <QuestionMarkIcon />
        },

    ];

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

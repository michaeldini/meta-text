import React from 'react';
import { Box, ToggleButtonGroup, ToggleButton, Tooltip, Typography } from '@mui/material';
import { CompareArrowsIcon, PhotoIcon, NotesIcon } from '../../../../components/icons';
import { useChunkStore } from '../../../../store/chunkStore';
import CopyTool from '../../tools/copy/CopyTool';
import { getLayoutsStyles } from '../layouts.styles';
import { useTheme } from '@mui/material/styles';

interface ChunkToolsNavbarProps {
    /** Whether this component is rendered as a floating element */
    isFloating?: boolean;
    /** Additional CSS class name */
    className?: string;
    /** Test ID for testing */
    'data-testid'?: string;
}

interface TooltipToggleButtonProps {
    value: string;
    ariaLabel: string;
    tooltipTitle: React.ReactNode;
    icon: React.ReactNode;
    tooltipProps: any;
}

const TooltipToggleButton: React.FC<TooltipToggleButtonProps> = ({
    value,
    ariaLabel,
    tooltipTitle,
    icon,
    tooltipProps
}) => (
    <Tooltip title={tooltipTitle} {...tooltipProps}>
        <ToggleButton value={value} aria-label={ariaLabel}>
            {icon}
        </ToggleButton>
    </Tooltip>
);

const ChunkToolsNavbar: React.FC<ChunkToolsNavbarProps> = ({
    className,
    'data-testid': dataTestId = 'chunk-tools-navbar'
}) => {
    const theme = useTheme();
    const styles = getLayoutsStyles(theme);
    const activeChunkId = useChunkStore(state => state.activeChunkId);
    const activeTabs = useChunkStore(state => state.activeTabs);
    const setActiveTabs = useChunkStore(state => state.setActiveTabs);

    const isDisabled = !activeChunkId;


    // Allow multiple selection
    const handleTabsChange = (_: any, tabs: Array<'comparison' | 'ai-image' | 'notes-summary'>) => {
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
        }
    ];

    return (
        <Box
            sx={styles.toolsContainer}
            data-testid={dataTestId}
            className={className}
        >
            <ToggleButtonGroup
                value={activeTabs}
                onChange={handleTabsChange}
                size="small"
                orientation="vertical"
            >
                {toggleButtons.map((button) => (
                    <Tooltip
                        key={button.value}
                        title={button.tooltipTitle}
                        {...styles.tooltipProps}
                    >
                        <ToggleButton value={button.value} aria-label={button.ariaLabel} disabled={isDisabled}>
                            {button.icon}
                        </ToggleButton>
                    </Tooltip>
                ))}
            </ToggleButtonGroup>
            <Box sx={styles.toolButtonsContainer}>
                <Tooltip
                    title={<Typography variant="caption">Copy the active chunk</Typography>}
                    {...styles.tooltipProps}
                >
                    <span style={{ display: 'inline-block' }}>
                        <CopyTool />
                    </span>
                </Tooltip>
            </Box>
        </Box>
    );
};

export default ChunkToolsNavbar;

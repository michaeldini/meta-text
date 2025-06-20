import React from 'react';
import { Box, Fade, useTheme } from '@mui/material';
import ChunkToolsNavbar from './ChunkToolsNavbar';
import { useChunkStore } from '../../../store/chunkStore';

interface FloatingChunkToolbarProps {
    /** Additional CSS class name */
    className?: string;
    /** Test ID for testing */
    'data-testid'?: string;
}

/**
 * FloatingChunkToolbar - A floating component that displays chunk tools in the top right corner
 * 
 * Features:
 * - Fixed positioning in top right corner
 * - Only shows when there's an active chunk
 * - Smooth fade in/out transition
 * - Responsive positioning that avoids NavBar
 * - Z-index that doesn't interfere with modals
 */
const FloatingChunkToolbar: React.FC<FloatingChunkToolbarProps> = ({
    className,
    'data-testid': dataTestId = 'floating-chunk-toolbar'
}) => {
    const theme = useTheme();
    const activeChunkId = useChunkStore(state => state.activeChunkId);

    // Only show if there's an active chunk
    const shouldShow = Boolean(activeChunkId);

    const floatingStyles = {
        position: 'fixed' as const,
        top: {
            xs: 72, // Account for mobile NavBar height (56px) + padding
            sm: 80, // Account for desktop NavBar height (64px) + padding
        },
        right: {
            xs: theme.spacing(1),
            sm: theme.spacing(2),
        },
        zIndex: theme.zIndex.speedDial, // High enough to be above content, but below modals
        transition: theme.transitions.create(['opacity', 'transform'], {
            duration: theme.transitions.duration.short,
        }),
        // Ensure it doesn't interfere with scrolling
        pointerEvents: shouldShow ? 'auto' : 'none',
    };

    return (
        <Fade in={shouldShow} timeout={300}>
            <Box
                sx={floatingStyles}
                className={className}
                data-testid={dataTestId}
            >
                <ChunkToolsNavbar
                    isFloating={true}
                    data-testid="floating-chunk-tools-navbar"
                />
            </Box>
        </Fade>
    );
};

export default FloatingChunkToolbar;

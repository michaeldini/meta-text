import React from 'react';
import { Box, Fade, useTheme } from '@mui/material';
import { useLocation } from 'react-router-dom';
import ChunkToolsNavbar from './ChunkToolsNavbar';
import { useChunkStore } from '../../../../store/chunkStore';

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
 * - Only shows when there's an active chunk AND user is on MetaTextDetailPage
 * - Smooth fade in/out transition
 * - Responsive positioning that avoids NavBar
 * - Z-index that doesn't interfere with modals
 */
const FloatingChunkToolbar: React.FC<FloatingChunkToolbarProps> = ({
    className,
    'data-testid': dataTestId = 'floating-chunk-toolbar'
}) => {
    const theme = useTheme();
    const location = useLocation();
    const activeChunkId = useChunkStore(state => state.activeChunkId);

    // Check if we're on the MetaTextDetailPage (matches /metaText/:metaTextId but not /metaText/:metaTextId/review)
    const isOnMetaTextDetailPage = /^\/metaText\/[^\/]+$/.test(location.pathname);

    // Only show if there's an active chunk AND we're on the MetaTextDetailPage
    const shouldShow = Boolean(activeChunkId) && isOnMetaTextDetailPage;

    const floatingStyles = {
        padding: 0,
        width: '48px', // Width for desktop
        position: 'fixed' as const,
        top: 72, // Account for desktop NavBar height (64px) + padding
        right: theme.spacing(2),
        zIndex: theme.zIndex.speedDial, // High enough to be above content, but below modals
        transition: theme.transitions.create(['opacity', 'transform'], {
            duration: theme.transitions.duration.short,
        }),
        // Ensure it doesn't interfere with scrolling
        pointerEvents: shouldShow ? 'auto' : 'none',
    };

    return (
        <Fade in={shouldShow} timeout={300} >
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
        </Fade >
    );
};

export default FloatingChunkToolbar;

import React from 'react';
import ReactDOM from 'react-dom';
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
 * - Fixed positioning in top right corner with responsive spacing
 * - Only shows when there's an active chunk AND user is on MetaTextDetailPage
 * - Smooth fade in/out transition
 * - Responsive positioning that avoids NavBar and viewport edges
 * - Z-index that doesn't interfere with modals
 * - Production-safe spacing that works consistently across build environments
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
        width: '48px',
        position: 'fixed' as const,
        top: '72px',
        right: '15px',
        zIndex: theme.zIndex.speedDial, // High enough to be above content, but below modals
        transition: theme.transitions.create(['opacity', 'transform'], {
            duration: theme.transitions.duration.short,
        }),
        // Ensure it doesn't interfere with scrolling
        pointerEvents: shouldShow ? 'auto' : 'none',
    };

    const toolbarContent = (
        <Fade in={shouldShow} timeout={1000}>
            <Box
                sx={floatingStyles}
                className={className}
                data-testid={dataTestId}
            >
                <ChunkToolsNavbar
                    data-testid="floating-chunk-tools-navbar"
                />
            </Box>
        </Fade>
    );

    return ReactDOM.createPortal(toolbarContent, document.body);
};

export default FloatingChunkToolbar;

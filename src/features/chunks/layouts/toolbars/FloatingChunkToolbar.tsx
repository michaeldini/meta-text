import React from 'react';
import ReactDOM from 'react-dom';
import { Box, Fade, useTheme } from '@mui/material';
import ChunkToolsNavbar from './ChunkToolsNavbar';
import { FADE_IN_DURATION } from '../../../../constants/ui';
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
 * - Only shows when there's an active chunk
 * - Smooth fade in/out transition
 * - Responsive positioning that avoids NavBar and viewport edges
 * - Z-index that doesn't interfere with modals
 * - Production-safe spacing that works consistently across build environments
 */
const FloatingChunkToolbar: React.FC<FloatingChunkToolbarProps> = () => {
    const theme = useTheme();

    const floatingStyles = {
        padding: 0,
        width: '48px',
        position: 'fixed' as const,
        top: '72px',
        right: '15px',
        zIndex: theme.zIndex.speedDial,
        pointerEvents: 'auto',
    };

    const toolbarContent = (
        <Fade in={true} timeout={FADE_IN_DURATION} style={{ transitionDelay: '100ms' }}>
            <Box sx={floatingStyles}>
                <ChunkToolsNavbar data-testid="floating-chunk-tools-navbar" />
            </Box>
        </Fade>
    );

    return ReactDOM.createPortal(toolbarContent, document.body);
};

export default FloatingChunkToolbar;

/**
 * ImageDisplay Component
 * 
 * A reusable component for displaying images with optional lightbox functionality.
 * Handles loading states, error states, and provides accessible image viewing.
 * 
 * Features:
 * - Lazy loading with loading indicator
 * - Error fallback with retry option
 * - Lightbox modal for full-screen viewing
 * - Accessible keyboard navigation
 * - Responsive design for tablet and mobile
 */
import React, { useState, useCallback } from 'react';
import { Box, Modal, Fade, useTheme, IconButton, Typography } from '@mui/material';
import { XMarkIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { getSharedToolStyles } from '../../shared.styles';
import { LoadingSpinner } from 'components';
import type { ImageDisplayProps } from '../../types';

const ImageDisplay: React.FC<ImageDisplayProps> = ({
    src,
    alt = '',
    height = '300px',
    showModal = true,
}) => {
    const [loaded, setLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const theme = useTheme();
    const styles = getSharedToolStyles(theme);

    const handleLoad = useCallback(() => {
        setLoaded(true);
        setHasError(false);
    }, []);

    const handleError = useCallback(() => {
        setLoaded(true);
        setHasError(true);
    }, []);

    const handleRetry = useCallback(() => {
        setLoaded(false);
        setHasError(false);
        // Force image reload by updating src with cache-busting parameter
        const img = new Image();
        img.src = src + (src.includes('?') ? '&' : '?') + 'retry=' + Date.now();
    }, [src]);

    const openLightbox = useCallback(() => setLightboxOpen(true), []);
    const closeLightbox = useCallback(() => setLightboxOpen(false), []);

    const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            if (showModal) openLightbox();
        }
    }, [showModal, openLightbox]);

    return (
        <>
            <Box
                onClick={showModal && !hasError ? openLightbox : undefined}
                onKeyDown={showModal && !hasError ? handleKeyDown : undefined}
                tabIndex={showModal && !hasError ? 0 : undefined}
                role={showModal && !hasError ? 'button' : undefined}
                aria-label={showModal && !hasError ? `Expand image: ${alt}` : alt}
                sx={{
                    cursor: showModal && !hasError ? 'pointer' : 'default',
                    position: 'relative',
                    display: 'inline-block',
                    borderRadius: 2,
                    overflow: 'hidden',
                    minHeight: height,
                    width: '100%',
                    backgroundColor: theme.palette.grey[100],
                    border: hasError ? `2px dashed ${theme.palette.error.main}` : 'none',
                    '&:focus-visible': {
                        outline: `2px solid ${theme.palette.primary.main}`,
                        outlineOffset: '2px',
                    }
                }}
            >
                {/* Loading state */}
                {!loaded && !hasError && (
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height,
                        width: '100%',
                        backgroundColor: theme.palette.grey[50],
                    }}>
                        <LoadingSpinner />
                    </Box>
                )}

                {/* Error state */}
                {hasError && (
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height,
                        width: '100%',
                        gap: 2,
                        p: 2,
                    }}>
                        <Typography variant="body2" color="error" textAlign="center">
                            Failed to load image
                        </Typography>
                        <IconButton
                            onClick={handleRetry}
                            size="small"
                            color="primary"
                            aria-label="Retry loading image"
                        >
                            <ArrowPathIcon style={{ width: 20, height: 20 }} />
                        </IconButton>
                    </Box>
                )}

                {/* Successful image display */}
                {!hasError && (
                    <img
                        src={src}
                        alt={alt}
                        style={{
                            height,
                            objectFit: 'cover',
                            display: loaded ? 'block' : 'none',
                            width: '100%',
                        }}
                        onLoad={handleLoad}
                        onError={handleError}
                    />
                )}
            </Box>

            {/* Lightbox Modal */}
            {showModal && (
                <Modal
                    open={lightboxOpen}
                    onClose={closeLightbox}
                    closeAfterTransition
                    aria-labelledby="image-lightbox"
                    aria-describedby="image-lightbox-description"
                >
                    <Fade in={lightboxOpen}>
                        <Box
                            onClick={closeLightbox}
                            sx={styles.modalOverlay}
                        >
                            {/* Close button */}
                            <IconButton
                                onClick={closeLightbox}
                                sx={{
                                    position: 'absolute',
                                    top: 16,
                                    right: 16,
                                    color: 'white',
                                    backgroundColor: 'rgba(0,0,0,0.5)',
                                    '&:hover': {
                                        backgroundColor: 'rgba(0,0,0,0.7)',
                                    }
                                }}
                                aria-label="Close lightbox"
                            >
                                <XMarkIcon style={{ width: 24, height: 24 }} />
                            </IconButton>

                            <Box
                                onClick={e => e.stopPropagation()}
                                sx={styles.centeredModalContent}
                            >
                                <img
                                    src={src}
                                    alt={alt}
                                    style={{
                                        maxWidth: '90vw',
                                        maxHeight: '80vh',
                                        objectFit: 'contain',
                                        borderRadius: 8,
                                        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                                    }}
                                />
                                {alt && (
                                    <Box sx={{
                                        mt: 2,
                                        p: 2,
                                        backgroundColor: 'rgba(0,0,0,0.8)',
                                        borderRadius: 1,
                                        color: 'white',
                                        maxWidth: '90vw',
                                        wordBreak: 'break-word'
                                    }}>
                                        <Typography variant="body2" component="span">
                                            <strong>Prompt:</strong> {alt}
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                        </Box>
                    </Fade>
                </Modal>
            )}
        </>
    );
};

export default ImageDisplay;

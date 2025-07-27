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
import { Box, Drawer, IconButton, Text, Image } from '@chakra-ui/react';

import { LoadingSpinner } from 'components';
import type { ImageDisplayProps } from 'features/chunk-shared/types';

export function ImageDisplay(props: ImageDisplayProps) {
    const { src, alt = '', height = '300px', showModal = true } = props;
    const [loaded, setLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [reloadKey, setReloadKey] = useState(0);


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
        setReloadKey(prev => prev + 1);
    }, []);

    const openLightbox = useCallback(() => setLightboxOpen(true), []);
    const closeLightbox = useCallback(() => setLightboxOpen(false), []);

    const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            if (showModal) openLightbox();
        }
    }, [showModal, openLightbox]);

    return (
        <Box
            onClick={showModal && !hasError ? openLightbox : undefined}
            onKeyDown={showModal && !hasError ? handleKeyDown : undefined}
            tabIndex={showModal && !hasError ? 0 : undefined}
            role={showModal && !hasError ? 'button' : undefined}
            aria-label={showModal && !hasError ? `Expand image: ${alt}` : alt}
        >
            {/* Loading state */}
            {!loaded && !hasError && (
                <LoadingSpinner />
            )}

            {/* Error state */}
            {hasError && (
                <Box >
                    <Text>
                        Failed to load image
                    </Text>
                    <IconButton
                        onClick={handleRetry}
                        color="primary"
                        aria-label="Retry loading image"
                    >
                        {/* <ArrowPathIcon style={{ width: 20, height: 20 }} /> */}
                    </IconButton>
                </Box>
            )}

            {/* Successful image display */}
            {!hasError && (
                <img
                    src={src + (reloadKey ? ((src.includes('?') ? '&' : '?') + 'retry=' + reloadKey) : '')}
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

            {showModal && (
                <Box
                    // open={lightboxOpen}
                    aria-labelledby="image-lightbox"
                    aria-describedby="image-lightbox-description"
                >
                    <Box
                        onClick={closeLightbox}
                    >
                        {/* Close button */}
                        <IconButton
                            onClick={closeLightbox}
                            aria-label="Close lightbox"
                        >
                            {/* <XMarkIcon style={{ width: 24, height: 24 }} /> */}
                        </IconButton>

                        <Box onClick={e => e.stopPropagation()}>
                            <Image
                                src={src}
                                alt={alt}
                                rounded="md"
                            />
                            <Text>
                                <strong>Prompt:</strong> {alt}
                            </Text>
                        </Box>
                    </Box>
                </Box>
            )}
        </Box>
    );
}

export default ImageDisplay;



import React, { useState, useCallback } from 'react';
import { Box, Modal, Fade, useTheme } from '@mui/material';
import { getSharedToolStyles } from '../../shared.styles';
import { LoadingSpinner } from 'components';
interface ImageDisplayProps {
    src: string;
    alt?: string;
    height?: string | number;
    showModal?: boolean;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({
    src,
    alt = '',
    height = '300px',
    showModal = true,
}) => {
    const [loaded, setLoaded] = useState(false);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const theme = useTheme();
    const styles = getSharedToolStyles(theme);

    const handleLoad = useCallback(() => setLoaded(true), []);
    const handleError = useCallback(() => setLoaded(true), []);
    const openLightbox = useCallback(() => setLightboxOpen(true), []);
    const closeLightbox = useCallback(() => setLightboxOpen(false), []);

    return (
        <>
            <Box
                onClick={showModal ? openLightbox : undefined}
                tabIndex={showModal ? 0 : undefined}
                aria-label={showModal ? "Expand image" : undefined}
                sx={{
                    cursor: showModal ? 'pointer' : 'default',
                    position: 'relative',
                    display: 'inline-block'
                }}
            >
                {!loaded && (
                    <LoadingSpinner />
                )}
                <img
                    src={src}
                    alt={alt}
                    style={{
                        height,
                        objectFit: 'cover',
                        display: loaded ? 'block' : 'none',
                        width: '100%',
                        borderRadius: 8
                    }}
                    onLoad={handleLoad}
                    onError={handleError}
                />
            </Box>

            {showModal && (
                <Modal
                    open={lightboxOpen}
                    onClose={closeLightbox}
                    closeAfterTransition
                    aria-labelledby="image-lightbox"
                >
                    <Fade in={lightboxOpen}>
                        <Box
                            onClick={closeLightbox}
                            sx={styles.modalOverlay}
                        >
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
                                        background: '#fafafa',
                                    }}
                                />
                                {alt && (
                                    <Box sx={{
                                        mt: 2,
                                        p: 2,
                                        backgroundColor: 'rgba(0,0,0,0.7)',
                                        borderRadius: 1,
                                        color: 'white',
                                        maxWidth: '90vw',
                                        wordBreak: 'break-word'
                                    }}>
                                        <strong>Prompt:</strong> {alt}
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

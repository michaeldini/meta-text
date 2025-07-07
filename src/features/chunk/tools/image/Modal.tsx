import React from 'react';
import { Box, CircularProgress, Modal, Fade, useTheme } from '@mui/material';
import { getSharedToolStyles } from '../shared.styles';

export interface ChunkImageDisplayProps {
    imgSrc: string;
    imgPrompt?: string;
    imgLoaded: boolean;
    onLoad?: React.ReactEventHandler<HTMLImageElement>;
    onError?: React.ReactEventHandler<HTMLImageElement>;
    lightboxOpen: boolean;
    setLightboxOpen: (open: boolean) => void;
    height?: string | number;
}

const ChunkImageModal: React.FC<ChunkImageDisplayProps> = ({
    imgSrc,
    imgPrompt,
    imgLoaded,
    onLoad,
    onError,
    lightboxOpen,
    setLightboxOpen,
    height = '300px',
}) => {
    const theme = useTheme();
    const styles = getSharedToolStyles(theme);

    return (
        <>
            <Box sx={styles.toolTabContainerWide}
                onClick={() => setLightboxOpen(true)}
                tabIndex={0}
                aria-label="Expand image"
            >
                {!imgLoaded && (
                    <Box sx={styles.loadingOverlay}>
                        <CircularProgress />
                    </Box>
                )}
                <img
                    src={imgSrc}
                    alt={imgPrompt}
                    style={{ height, objectFit: 'cover', display: imgLoaded ? 'block' : 'none' }}
                    onLoad={onLoad}
                    onError={onError}
                />
            </Box>
            <Modal
                open={lightboxOpen}
                onClose={() => setLightboxOpen(false)}
                closeAfterTransition
                aria-labelledby="image-lightbox-title"
                aria-describedby="image-lightbox-description"
            >
                <Fade in={lightboxOpen}>
                    <Box
                        onClick={() => setLightboxOpen(false)}
                        sx={styles.modalOverlay}
                    >
                        <Box
                            onClick={e => e.stopPropagation()}
                            sx={styles.centeredModalContent}
                        >
                            <img
                                src={imgSrc}
                                alt={imgPrompt}
                                style={{
                                    maxWidth: '90vw',
                                    maxHeight: '80vh',
                                    objectFit: 'contain',
                                    borderRadius: 8,
                                    background: '#fafafa',
                                }}
                            />
                            <Box sx={styles.centeredModalContent}>
                                {imgPrompt && <div><b>Prompt:</b> {imgPrompt}</div>}
                            </Box>
                        </Box>
                    </Box>
                </Fade>
            </Modal>
        </>
    );
};

export default ChunkImageModal;

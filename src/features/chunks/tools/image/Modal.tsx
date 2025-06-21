import React from 'react';
import { Box, CircularProgress, Modal, Fade } from '@mui/material';
import { chunkImageBox, chunkImageLoadingOverlay, chunkLightboxModal, chunkLightboxImgBox, chunkLightboxPromptBox } from './styles/styles';

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
}) => (
    <>
        <Box sx={chunkImageBox}
            onClick={() => setLightboxOpen(true)}
            tabIndex={0}
            aria-label="Expand image"
        >
            {!imgLoaded && (
                <Box sx={chunkImageLoadingOverlay}>
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
                    sx={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        bgcolor: 'rgba(0,0,0,0.7)',
                        zIndex: 1300,
                        outline: 'none',
                        ...chunkLightboxModal
                    }}
                >
                    <Box
                        onClick={e => e.stopPropagation()}
                        sx={chunkLightboxImgBox}
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
                        <Box sx={chunkLightboxPromptBox}>
                            {imgPrompt && <div><b>Prompt:</b> {imgPrompt}</div>}
                        </Box>
                    </Box>
                </Box>
            </Fade>
        </Modal>
    </>
);

export default ChunkImageModal;

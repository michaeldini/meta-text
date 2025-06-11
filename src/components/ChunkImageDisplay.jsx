import React from 'react';
import { Box, CircularProgress, Modal, Fade } from '@mui/material';
import {
    chunkImageBox,
    chunkImageLoadingOverlay,
    chunkImagePromptBox,
    chunkLightboxModal,
    chunkLightboxImgBox,
    chunkLightboxPromptBox
} from '../styles/pageStyles';

/**
 * ChunkImageDisplay - handles image display, loading overlay, prompt/date, and lightbox modal
 * Props:
 *   imgSrc, imgPrompt, imgLoaded, onLoad, onError, lightboxOpen, setLightboxOpen, createdAt, styles
 */
const ChunkImageDisplay = ({
    imgSrc,
    imgPrompt,
    imgLoaded,
    onLoad,
    onError,
    lightboxOpen,
    setLightboxOpen,
    createdAt,
    height = '400px', // new prop with default
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
            {/* Do not show prompt in small mode */}
        </Box>
        {/* Lightbox Modal */}
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
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
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
                                maxWidth: '80vw',
                                maxHeight: '70vh',
                                objectFit: 'contain',
                                borderRadius: 8,
                                background: '#fafafa',
                            }}
                        />
                        <Box sx={chunkLightboxPromptBox}>
                            {imgPrompt && <div><b>Prompt:</b> {imgPrompt}</div>}
                            {createdAt && (
                                <div><b>Generated:</b> {new Date(createdAt).toLocaleString()}</div>
                            )}
                        </Box>
                    </Box>
                </Box>
            </Fade>
        </Modal>
    </>
);

export default ChunkImageDisplay;

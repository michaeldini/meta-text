import React from 'react';
import { Box, CircularProgress, Modal, Fade } from '@mui/material';

/**
 * ChunkImageDisplay - handles image display, loading overlay, prompt/date, and lightbox modal
 * Props:
 *   imgSrc, imgKey, imgPrompt, imgLoaded, onLoad, onError, lightboxOpen, setLightboxOpen, createdAt, styles
 */
const ChunkImageDisplay = ({
    imgSrc,
    imgKey,
    imgPrompt,
    imgLoaded,
    onLoad,
    onError,
    lightboxOpen,
    setLightboxOpen,
    createdAt,
    styles
}) => (
    <>
        <Box sx={styles.imageBox}
            onClick={() => setLightboxOpen(true)}
            tabIndex={0}
            aria-label="Expand image"
        >
            {!imgLoaded && (
                <Box sx={styles.imageLoadingOverlay}>
                    <CircularProgress size={48} />
                </Box>
            )}
            <img
                src={imgSrc}
                key={imgKey}
                alt={imgPrompt}
                style={{ width: 400, height: 400, objectFit: 'cover', display: imgLoaded ? 'block' : 'none' }}
                onLoad={onLoad}
                onError={onError}
            />
            {/* Show prompt and date if available */}
            <Box sx={styles.imagePromptBox}>
                {imgPrompt && <div><b>Prompt:</b> {imgPrompt}</div>}
                {createdAt && (
                    <div><b>Generated:</b> {new Date(createdAt).toLocaleString()}</div>
                )}
            </Box>
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
                        ...styles.lightboxModal
                    }}
                >
                    <Box
                        onClick={e => e.stopPropagation()}
                        sx={styles.lightboxImgBox}
                    >
                        <img
                            src={imgSrc}
                            key={imgKey}
                            alt={imgPrompt}
                            style={{
                                maxWidth: '80vw',
                                maxHeight: '70vh',
                                objectFit: 'contain',
                                borderRadius: 8,
                                background: '#fafafa',
                            }}
                        />
                        <Box sx={styles.lightboxPromptBox}>
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

import { HiOutlineSparkles } from 'react-icons/hi2';
/**
 * Image generation tool
 * Provides an interface for generating and displaying images for text chunks.
 */
import React from 'react';
import { Box, Text, Button } from '@styles';
import { ErrorAlert } from '@components/ErrorAlert';
import { TooltipButton } from '@components/TooltipButton';

import { useImageTool } from './hooks/useImageTool';
import ImageGenerationDialog from './components/ImageGenerationDialog';
import type { ChunkType } from '@mtypes/documents';
import { SimpleDrawer } from '@components/ui';
import { Select } from '@components/ui/select';

interface ImageToolProps {
    chunk: ChunkType;
    isVisible: boolean;
}

export function ImageTool(props: ImageToolProps) {
    const { chunk, isVisible } = props;
    // Initialize hook with chunk data - provides state management and API integration
    const {
        handleGenerateImage,    // Function to trigger AI image generation
        state,                  // Current component state (loading, error, data, prompt, dialogOpen, selectedId)
        getImgSrc,              // Helper to construct image source URL from selected image
        handlePromptChange,     // Prompt change handler
        setSelectedId,          // Sets selected image id
        loading,                // Generation in progress
        error,                  // Error state
        hasImage,               // Whether any image exists
        images,                 // All images for the chunk
        selected,               // Currently selected image object
    } = useImageTool(chunk);


    // Local UI state
    const [imgLoaded, setImgLoaded] = React.useState(false);
    const [imgError, setImgError] = React.useState(false);
    const [imageSrc, setImageSrc] = React.useState<string | null>(null);
    const [viewerOpen, setViewerOpen] = React.useState(false);
    // Close on ESC
    React.useEffect(() => {
        if (!viewerOpen) return;
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setViewerOpen(false); };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [viewerOpen]);

    // Sync local image src whenever the chunk image availability changes
    React.useEffect(() => {
        if (hasImage) {
            const src = getImgSrc();
            // Only reset loading state if the path actually changed
            setImageSrc(prev => {
                if (prev !== src) {
                    setImgLoaded(false);
                    setImgError(false);
                }
                return src;
            });
        } else {
            setImageSrc(null);
            setImgLoaded(false);
            setImgError(false);
        }
        // Depend on image path (via state.imagePath through getImgSrc) and selection
    }, [hasImage, getImgSrc, state.selectedId, chunk.id]);


    const handleDialogSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const result = await handleGenerateImage();
        if (result.imagePath) {
            close();
        }
    };
    if (!isVisible) return null;
    return (
        <>
            <Box>
                {hasImage && (
                    <Box >
                        {/* Select to browse previous images */}
                        {images.length > 1 && (
                            <Box>
                                <label htmlFor={`image-select-${chunk.id}`}>Browse previous images:</label>
                                <Select
                                    options={[{ label: "Latest image", value: "" }, ...images.map(img => ({ label: `Image ${img.id}`, value: String(img.id) }))]}
                                    value={state.selectedId === null ? "" : String(state.selectedId)}
                                    onChange={(val: string) => setSelectedId(val === "" ? null : Number(val))}
                                    placeholder="Browse previous images"
                                />
                            </Box>
                        )}
                        {/* Loader */}
                        {!imgLoaded && !imgError && (
                            <Box>
                                <span style={{ fontSize: 32, color: '#aaa' }}>⏳</span>
                            </Box>
                        )}
                        {/* Error */}
                        {imgError && (
                            <Box>
                                <ErrorAlert message={<Text css={{ fontSize: '0.9rem' }}>Image unavailable</Text>} />
                            </Box>
                        )}
                        {/* Image */}
                        {imageSrc && !imgError && (
                            <img
                                src={state.selectedId ? `${imageSrc}?img=${state.selectedId}` : imageSrc}
                                alt={selected?.prompt || state.prompt}
                                style={{ height: '100%', width: '240px', objectFit: 'cover', display: imgLoaded ? 'block' : 'none', borderRadius: 8, cursor: imgLoaded ? 'pointer' : 'default' }}
                                title={imgLoaded ? 'Click to view full size' : undefined}
                                onClick={() => { if (imgLoaded) setViewerOpen(true); }}
                                onLoad={() => setImgLoaded(true)}
                                onError={() => {
                                    setImgLoaded(true);
                                    setImgError(true);
                                }}
                            />
                        )}
                    </Box>
                )}
            </Box>
            <SimpleDrawer
                title="Generate Image"
                triggerButton={<TooltipButton
                    label={hasImage ? "Generate New Image" : "Generate Image"}
                    tooltip="Generate an image for this chunk using AI"
                    icon={<HiOutlineSparkles />}
                    disabled={loading}
                    loading={loading}
                />}
            >
                <ImageGenerationDialog
                    prompt={state.prompt}
                    loading={loading}
                    error={error}
                    onPromptChange={handlePromptChange}
                    onSubmit={handleDialogSubmit}
                />
            </SimpleDrawer>
            {viewerOpen && (
                <Box
                    css={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 1400, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    onClick={() => setViewerOpen(false)}
                    role="dialog"
                    aria-modal="true"
                >
                    <Box
                        css={{ position: 'absolute', top: 24, right: 32, fontSize: '2rem', color: '#eee', cursor: 'pointer' }}
                        onClick={() => setViewerOpen(false)}
                        aria-label="Close image viewer"
                    >
                        ×
                    </Box>
                    {imageSrc && (
                        <img
                            src={state.selectedId ? `${imageSrc}?img=${state.selectedId}&full=1` : imageSrc}
                            alt={selected?.prompt || state.prompt}
                            style={{ maxHeight: '90vh', maxWidth: '90vw', objectFit: 'contain', borderRadius: 8, animation: 'fade-in .5s' }}
                            onClick={e => e.stopPropagation()}
                        />
                    )}
                </Box>
            )}
        </>
    );
};

export default ImageTool;

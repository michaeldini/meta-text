import { Icon } from '@components/icons/Icon';
/**
 * Image generation tool
 * Provides an interface for generating and displaying images for text chunks.
 */
import React from 'react';
import { Box } from '@chakra-ui/react/box';
import { Image } from '@chakra-ui/react/image';
import { Spinner } from '@chakra-ui/react/spinner';

import { Text } from '@chakra-ui/react/text';
import { ErrorAlert } from '@components/ErrorAlert';
import { TooltipButton } from '@components/TooltipButton';

import { useImageTool } from './hooks/useImageTool';
import ImageGenerationDialog from './components/ImageGenerationDialog';
import type { ChunkType } from '@mtypes/documents';

interface ImageToolProps {
    chunk: ChunkType;
    isVisible: boolean;
}

export function ImageTool(props: ImageToolProps) {
    const { chunk, isVisible } = props;
    if (!isVisible) return null;
    // Initialize hook with chunk data - provides state management and API integration
    const {
        handleGenerateImage,    // Function to trigger AI image generation
        state,                  // Current component state (loading, error, data, prompt, dialogOpen, selectedId)
        getImgSrc,              // Helper to construct image source URL from selected image
        openDialog,             // Opens generation dialog
        closeDialog,            // Closes dialog
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
        // probably put error handling here, but will need to modify hook first! TODO
    };

    return (
        <>
            {/* Main tool container with consistent styling */}
            <Box>
                {/* Primary action button for image generation */}
                <TooltipButton
                    label={hasImage ? "Generate New Image" : "Generate Image"}
                    tooltip="Generate an image for this chunk using AI"
                    icon={<Icon name='AISparkle' />}
                    onClick={openDialog}
                    disabled={loading}
                    loading={loading}
                />

                {hasImage && (
                    <Box >
                        {/* Select to browse previous images */}
                        {images.length > 1 && (
                            <Box mt={4} mb={4}>
                                <label htmlFor={`image-select-${chunk.id}`}>Browse previous images:</label>
                                <select
                                    id={`image-select-${chunk.id}`}
                                    value={state.selectedId === null ? '' : String(state.selectedId)}
                                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                        const val = e.target.value === '' ? null : Number(e.target.value);
                                        setSelectedId(val);
                                    }}
                                    style={{ width: '100%', marginTop: 8 }}
                                >
                                    <option value="">Latest image</option>
                                    {images.map(img => (
                                        <option key={img.id} value={img.id}>{`Image ${img.id}`}</option>
                                    ))}
                                </select>
                            </Box>
                        )}
                        {/* Loader */}
                        {!imgLoaded && !imgError && (
                            <Box display="flex" alignItems="center" justifyContent="center" h="300px" bg="blackAlpha.50" rounded="md">
                                <Spinner size="lg" />
                            </Box>
                        )}
                        {/* Error */}
                        {imgError && (
                            <Box h="300px" rounded="md" border="1px dashed" borderColor="red.200" p={2} display="flex" alignItems="center" justifyContent="center" bg="red.25">
                                <ErrorAlert message={<Text fontSize="sm">Image unavailable</Text>} />
                            </Box>
                        )}
                        {/* Image */}
                        {imageSrc && !imgError && (
                            <Image
                                src={state.selectedId ? `${imageSrc}?img=${state.selectedId}` : imageSrc}
                                alt={selected?.prompt || state.prompt}
                                h="100%"
                                w="100%"
                                objectFit="cover"
                                display={imgLoaded ? 'block' : 'none'}
                                rounded="md"
                                cursor={imgLoaded ? 'pointer' : 'default'}
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
            {/* Image generation dialog - always rendered but controlled by state.dialogOpen */}
            <ImageGenerationDialog
                open={state.dialogOpen}
                prompt={state.prompt}
                loading={loading}
                error={error}
                onClose={closeDialog}
                onPromptChange={handlePromptChange}
                onSubmit={handleDialogSubmit}
            />
            {viewerOpen && (
                <Box
                    position="fixed"
                    top={0}
                    left={0}
                    w="100vw"
                    h="100vh"
                    zIndex={1400}
                    bg="blackAlpha.800"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    onClick={() => setViewerOpen(false)}
                    role="dialog"
                    aria-modal="true"
                >
                    <Box
                        position="absolute"
                        top={3}
                        right={4}
                        fontSize="2xl"
                        color="whiteAlpha.800"
                        cursor="pointer"
                        onClick={() => setViewerOpen(false)}
                        aria-label="Close image viewer"

                    >
                        ×
                    </Box>
                    {imageSrc && (
                        <Image
                            src={state.selectedId ? `${imageSrc}?img=${state.selectedId}&full=1` : imageSrc}
                            alt={selected?.prompt || state.prompt}
                            maxH="90vh"
                            maxW="90vw"
                            objectFit="contain"
                            rounded="md"
                            onClick={e => e.stopPropagation()}
                            animationName="fade-in"
                            animationDuration=".5s"

                        />
                    )}
                </Box>
            )}
        </>
    );
};

export default ImageTool;

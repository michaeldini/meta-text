/**
 * Image generation tool
 * Provides an interface for generating and displaying images for text chunks.
 */
import React from 'react';
import { Box } from '@chakra-ui/react/box';
import { Image } from '@chakra-ui/react/image';
import { Spinner } from '@chakra-ui/react/spinner';
import { Text } from '@chakra-ui/react/text';

import { HiOutlineSparkles } from "react-icons/hi2";
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
        state,           // Current component state (loading, error, data, prompt, dialogOpen)
        getImgSrc,       // Helper to construct image source URL
        openDialog,      // Function to open the generation dialog
        closeDialog,     // Function to close the dialog and reset state
        handlePromptChange, // Handler for prompt input changes
        loading,         // Boolean indicating if generation is in progress
        error,           // Error message string (null if no error)
        hasImage         // Boolean indicating if image exists
    } = useImageTool(chunk);

    // Local UI state
    const [imgLoaded, setImgLoaded] = React.useState(false);
    const [imgError, setImgError] = React.useState(false);
    const [imageSrc, setImageSrc] = React.useState<string | null>(null);

    // Sync local image src whenever the chunk image availability changes
    React.useEffect(() => {
        if (hasImage) {
            const src = getImgSrc();
            setImageSrc(src);
            setImgLoaded(false);
            setImgError(false);
        } else {
            setImageSrc(null);
            setImgLoaded(false);
            setImgError(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasImage, chunk.id]);


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
                    icon={<HiOutlineSparkles />}
                    onClick={openDialog}
                    disabled={loading}
                    loading={loading}
                />

                {hasImage && (
                    <Box >
                        {/* Loader */}
                        {!imgLoaded && !imgError && (
                            <Box display="flex" alignItems="center" justifyContent="center" h="300px" bg="blackAlpha.50" rounded="md">
                                <Spinner size="lg" />
                            </Box>
                        )}
                        {/* Error */}
                        {imgError && (
                            <Box h="300px" rounded="md" bg="red.50" border="1px solid" borderColor="red.200" p={4} display="flex" alignItems="center" justifyContent="center">
                                <Text fontSize="sm" color="red.600">Image unavailable</Text>
                            </Box>
                        )}
                        {/* Image */}
                        {imageSrc && !imgError && (
                            <Image
                                src={imageSrc}
                                alt={state.prompt}
                                h="100%"
                                w="100%"
                                objectFit="cover"
                                display={imgLoaded ? 'block' : 'none'}
                                rounded="md"
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
        </>
    );
};

export default ImageTool;

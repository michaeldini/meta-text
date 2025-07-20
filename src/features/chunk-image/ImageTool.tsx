import React from 'react';
import { Box, useTheme, IconButton, Tooltip } from '@mui/material';
import { TrashIcon } from '@heroicons/react/24/outline';

import { AiGenerationButton } from 'components';

import { useImageTool } from './hooks/useImageTool';
import ImageDisplay from './components/ImageDisplay';
import ImageGenerationDialog from './components/ImageGenerationDialog';
import { getSharedToolStyles } from 'features/chunk-shared/styles';
import type { ChunkType, UpdateChunkFieldFn } from 'types';

interface ImageToolProps {
    chunk: ChunkType;
    updateChunkField: UpdateChunkFieldFn;
    isVisible: boolean;
}

const ImageTool: React.FC<ImageToolProps> = ({
    chunk,
    updateChunkField,
    isVisible,
}) => {
    if (!isVisible) return null;
    // Initialize hook with chunk data - provides state management and API integration
    const {
        generateImage,    // Function to trigger AI image generation
        deleteImage,      // Function to delete current image
        state,           // Current component state (loading, error, data, prompt, dialogOpen)
        getImgSrc,       // Helper to construct image source URL
        openDialog,      // Function to open the generation dialog
        closeDialog,     // Function to close the dialog and reset state
        handlePromptChange, // Handler for prompt input changes
        loading,         // Boolean indicating if generation is in progress
        error,           // Error message string (null if no error)
        hasImage         // Boolean indicating if image exists
    } = useImageTool(chunk);

    // Apply consistent theming across the component
    const theme = useTheme();
    const styles = getSharedToolStyles(theme);

    const handleDialogSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Trigger image generation with current chunk and prompt
        // The generateImage function handles loading states and error management
        await generateImage({
            chunk,
            prompt: state.prompt
        });
    };

    /**
     * Handles image deletion with confirmation
     */
    const handleDeleteImage = async () => {
        if (window.confirm('Are you sure you want to delete this image?')) {
            await deleteImage();
        }
    };

    return (
        <>
            {/* Main tool container with consistent styling */}
            <Box sx={styles.toolTabContainer}>
                {/* Action buttons container */}
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    mb: hasImage ? 2 : 0
                }}>
                    {/* Primary action button for image generation */}
                    <AiGenerationButton
                        label={hasImage ? "Generate New Image" : "Generate Image"}
                        toolTip="Generate an image for this chunk using AI"
                        loading={loading}
                        onClick={openDialog}
                        disabled={loading}
                    />

                    {/* Delete button - only show when image exists */}
                    {hasImage && (
                        <Tooltip title="Delete current image">
                            <IconButton
                                onClick={handleDeleteImage}
                                disabled={loading}
                                size="small"
                                color="error"
                                sx={{
                                    opacity: 0.7,
                                    '&:hover': { opacity: 1 }
                                }}
                            >
                                <TrashIcon style={{ width: 18, height: 18 }} />
                            </IconButton>
                        </Tooltip>
                    )}
                </Box>

                {/* Conditionally render image display if image data exists */}
                {hasImage && (
                    <ImageDisplay
                        src={getImgSrc()}
                        alt={state.prompt}    // Use prompt as alt text for accessibility
                        height="300px"       // Fixed height for consistent layout
                        showModal={true}     // Enable lightbox functionality
                    />
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

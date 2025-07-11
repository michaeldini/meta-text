/**
 * ImageTool Component
 * 
 * A React component that provides AI-powered image generation functionality for text chunks.
 * This tool allows users to generate contextual images based on chunk content and custom prompts.
 * 
 * Key Features:
 * - AI image generation with custom prompts
 * - Image display with lightbox modal functionality
 * - Loading states and error handling
 * - Responsive design for tablet and mobile
 * 
 * Architecture:
 * - Uses custom hook (useImageTool) for state management and API calls
 * - Composed of reusable sub-components (ImageDisplay, ImageGenerationDialog)
 * - Follows Material-UI design patterns and theming
 * 
 * @example
 * ```tsx
 * <ImageTool chunk={chunkData} />
 * ```
 */
import React from 'react';
import { Box, useTheme, IconButton, Tooltip } from '@mui/material';
import { TrashIcon } from '@heroicons/react/24/outline';

import { AiGenerationButton } from 'components';

import { useImageTool } from './useImageTool';
import ImageDisplay from './components/ImageDisplay';
import ImageGenerationDialog from './components/ImageGenerationDialog';
import { getSharedToolStyles } from '../shared.styles';
import { ImageToolProps } from '../types';

/**
 * ImageTool Component
 * 
 * Provides AI-powered image generation functionality for text chunks with an intuitive user interface.
 * 
 * @param props - Component props
 * @param props.chunk - The text chunk for which to generate images. Must contain valid chunk data with ID.
 * 
 * @returns JSX element containing the image generation interface
 * 
 * Component Structure:
 * 1. Generate Button - Triggers the image generation dialog
 * 2. Image Display - Shows generated image (if exists) with lightbox functionality
 * 3. Generation Dialog - Modal for entering custom prompts and generating images
 * 
 * State Management:
 * - Uses useImageTool hook for centralized state management
 * - Handles loading states, errors, and image data synchronization
 * - Manages dialog open/close states and prompt input
 * 
 * User Interactions:
 * - Click "Generate Image" to open prompt dialog
 * - Enter custom prompt and submit to generate image
 * - Click generated image to view in fullscreen lightbox
 * - Dialog handles validation (requires non-empty prompt)
 * 
 * Error Handling:
 * - Displays user-friendly error messages in dialog
 * - Handles API failures gracefully
 * - Provides loading indicators during generation
 */
const ImageTool: React.FC<ImageToolProps> = ({
    chunk,
}) => {
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

    /**
     * Handles form submission from the image generation dialog
     * Prevents default form behavior and triggers image generation with current prompt
     * 
     * @param e - Form submission event
     */
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

/**
 * Export ImageTool as default
 * 
 * Dependencies:
 * - useImageTool: Custom hook for state management and API calls
 * - ImageDisplay: Reusable component for image display with lightbox
 * - ImageGenerationDialog: Modal dialog for prompt input and generation
 * - AiGenerationButton: Shared component for AI-powered actions
 * - getSharedToolStyles: Consistent styling across chunk tools
 * 
 * Performance Considerations:
 * - Component re-renders are optimized through hook memoization
 * - Image loading is handled asynchronously with polling mechanism
 * - Error states are properly managed to prevent UI blocking
 * 
 * Accessibility:
 * - Uses semantic HTML elements and ARIA labels
 * - Provides meaningful alt text for generated images
 * - Keyboard navigation support through Material-UI components
 * - Loading states are announced to screen readers
 */
export default ImageTool;

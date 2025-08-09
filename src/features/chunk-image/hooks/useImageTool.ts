
import { useCallback, useState, useEffect } from 'react';

import { generateAiImage } from '@services/aiService';
import log from '@utils/logger';
import type { ChunkType, AiImage } from '@mtypes/documents';
import { pollImageAvailability } from '../utils/imagePolling';

import { ImageToolProps, ToolResult, UseImageToolReturn, ImageResult, ImageToolState } from '@mtypes/tools';

function getLatestAiImage(ai_images?: AiImage[]): AiImage | undefined {
    if (!ai_images || ai_images.length === 0) return undefined;
    return ai_images[ai_images.length - 1];
}

export const useImageTool = (chunk?: ChunkType): UseImageToolReturn => {
    // Initialize hook state with default values
    const [state, setState] = useState<ImageToolState>({
        loading: false,      // No operations in progress initially
        error: null,         // No errors on initialization
        data: null,          // No image data initially
        prompt: '',          // Empty prompt initially
        dialogOpen: false,   // Dialog closed initially
    });

    useEffect(() => {
        if (!chunk) return;

        const aiImage = getLatestAiImage(chunk.images);
        if (aiImage && typeof aiImage.path === 'string') {
            // Update state with latest image data and prompt
            setState(s => ({
                ...s,
                data: aiImage.path ?? null,
                prompt: aiImage.prompt ?? '',
            }));
        } else {
            // Clear state if no valid image exists
            setState(s => ({ ...s, data: null, prompt: '' }));
        }
    }, [chunk?.images]);

    const generateImage = useCallback(async (props: ImageToolProps): Promise<ToolResult<ImageResult>> => {
        const { prompt = '', chunk } = props;

        // Validate chunk ID before proceeding
        if (!chunk?.id || typeof chunk.id !== 'number') {
            return {
                success: false,
                error: 'Invalid chunk ID'
            };
        }

        // Set loading state and clear any previous errors
        setState(s => ({ ...s, loading: true, error: null }));

        try {
            // Call the AI image generation service
            const result = await generateAiImage(prompt, chunk.id);

            // Wait for image to be available on the server
            // This prevents displaying broken images due to timing issues
            const imgUrl = `/${result.path}`;
            await pollImageAvailability(imgUrl, 10000, 300);

            // Update state with successful result
            setState(s => ({
                ...s,
                data: result.path,
                prompt: result.prompt,
                loading: false,
                error: null,
                dialogOpen: false, // Close dialog on success
            }));

            return {
                success: true,
                data: {
                    imagePath: result.path,
                    prompt: result.prompt
                }
            };
        } catch (err: any) {
            // Handle and log errors
            const errorMessage = err?.message || 'Failed to generate image';
            log.error(errorMessage);
            setState(s => ({ ...s, error: errorMessage, loading: false }));

            return {
                success: false,
                error: errorMessage
            };
        }
    }, []);

    /**
     * Deletes the current AI image associated with the chunk
     * 
     * @returns Promise resolving to ToolResult indicating success/failure
     */
    const deleteImage = useCallback(async (): Promise<ToolResult<{ deleted: boolean }>> => {
        if (!chunk?.id || !state.data) {
            return {
                success: false,
                error: 'No image to delete'
            };
        }

        setState(s => ({ ...s, loading: true, error: null }));

        try {
            // Note: Add actual delete API call here when backend endpoint is available
            // await deleteAiImage(chunk.id);

            setState(s => ({
                ...s,
                data: null,
                prompt: '',
                loading: false,
                error: null,
            }));

            return {
                success: true,
                data: { deleted: true }
            };
        } catch (err: any) {
            const errorMessage = err?.message || 'Failed to delete image';
            log.error(errorMessage);
            setState(s => ({ ...s, error: errorMessage, loading: false }));

            return {
                success: false,
                error: errorMessage
            };
        }
    }, [chunk?.id, state.data]);

    /**
     * Retries image generation with the last used prompt
     * Useful for handling temporary failures or network issues
     */
    const retryGeneration = useCallback(async (): Promise<ToolResult<ImageResult>> => {
        if (!chunk || !state.prompt) {
            return {
                success: false,
                error: 'No previous prompt to retry'
            };
        }

        return generateImage({ chunk, prompt: state.prompt });
    }, [chunk, state.prompt, generateImage]);

    /**
     * Helper Functions
     * 
     * These functions provide convenient access to common operations and state updates.
     * All functions are memoized with useCallback to prevent unnecessary re-renders.
     */

    /**
     * Constructs the full image source URL from the stored path data
     * @returns Complete image URL or empty string if no image exists
     */
    const getImgSrc = useCallback(() => (state.data ? `/${state.data}` : ''), [state.data]);

    /**
     * Opens the image generation dialog and resets form state
     * Clears any previous errors and prompt text for a fresh start
     */
    const openDialog = useCallback(() => setState(s => ({
        ...s,
        dialogOpen: true,
        error: null,
        prompt: ''
    })), []);

    /**
     * Closes the image generation dialog and resets form state
     * Clears errors and prompt text when user cancels or completes generation
     */
    const closeDialog = useCallback(() => setState(s => ({
        ...s,
        dialogOpen: false,
        error: null,
        prompt: ''
    })), []);

    /**
     * Handles prompt input changes in the generation dialog
     * @param e - React change event from the prompt input field
     */
    const handlePromptChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) =>
        setState(s => ({ ...s, prompt: e.target.value })), []);

    /**
     * Hook Return Object
     * 
     * Returns all necessary state and functions for the ImageTool component.
     * This interface provides everything needed for image generation functionality.
     */
    return {
        // Core functionality
        generateImage,           // Function to trigger AI image generation
        deleteImage,            // Function to delete current image
        retryGeneration,        // Function to retry with last prompt

        // State object containing all internal state
        state,                   // Complete internal state object

        // Helper functions
        getImgSrc,              // Constructs image source URL
        openDialog,             // Opens generation dialog
        closeDialog,            // Closes generation dialog  
        handlePromptChange,     // Handles prompt input changes

        // Convenience state accessors (duplicated for easier access)
        loading: state.loading, // Boolean indicating generation in progress
        error: state.error,     // Current error message (null if no error)
        hasImage: Boolean(state.data), // Boolean indicating if image exists
    };
};

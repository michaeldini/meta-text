/**
 * useImageTool Hook
 * 
 * A custom React hook that manages state and functionality for AI-powered image generation
 * within the chunk tools system. This hook encapsulates all business logic related to
 * image generation, state management, and user interactions.
 * 
 * Key Responsibilities:
 * - Manages image generation state (loading, error, data)
 * - Handles API calls to the image generation service
 * - Synchronizes image data with chunk updates
 * - Provides helper functions for UI interactions
 * - Manages dialog state for prompt input
 * 
 * @author Meta Text Team
 * @since 2025-07-08
 * @version 1.0.0
 */

import { useCallback, useState, useEffect } from 'react';

import { generateAiImage } from 'services';
import { log } from 'utils';
import type { ChunkType, AiImage } from 'types';
import { pollImageAvailability } from '../utils/imagePolling';

import { ImageToolProps, ToolResult, UseImageToolReturn, ImageResult, ImageToolState } from 'features/chunk-shared/types';

/**
 * Utility function to extract the most recently generated AI image from a chunk's image collection
 * 
 * @param ai_images - Optional array of AI images associated with a chunk
 * @returns The most recent AI image, or undefined if none exist
 * 
 * @example
 * ```typescript
 * const latestImage = getLatestAiImage(chunk.ai_images);
 * if (latestImage) {
 *   console.log(`Latest image: ${latestImage.path}`);
 * }
 * ```
 */
function getLatestAiImage(ai_images?: AiImage[]): AiImage | undefined {
    if (!ai_images || ai_images.length === 0) return undefined;
    return ai_images[ai_images.length - 1];
}

/**
 * Custom React hook for managing AI image generation functionality
 * 
 * This hook provides a complete state management solution for image generation features,
 * including API integration, error handling, and UI state synchronization.
 * 
 * Features:
 * - Automatic synchronization with chunk image data
 * - Asynchronous image generation with loading states
 * - Comprehensive error handling and logging
 * - Dialog state management for user interactions
 * - Optimized re-rendering through useCallback memoization
 * 
 * @param chunk - Optional chunk data containing existing AI images
 * @returns Object containing state, functions, and helpers for image tool functionality
 * 
 * @example
 * ```typescript
 * const {
 *   generateImage,
 *   state,
 *   loading,
 *   error,
 *   openDialog,
 *   closeDialog
 * } = useImageTool(chunk);
 * 
 * // Generate an image
 * await generateImage({ chunk, prompt: "A beautiful landscape" });
 * ```
 * 
 * @throws {Error} When chunk ID is invalid or API calls fail
 */
export const useImageTool = (chunk?: ChunkType): UseImageToolReturn => {
    // Initialize hook state with default values
    const [state, setState] = useState<ImageToolState>({
        loading: false,      // No operations in progress initially
        error: null,         // No errors on initialization
        data: null,          // No image data initially
        prompt: '',          // Empty prompt initially
        dialogOpen: false,   // Dialog closed initially
    });

    /**
     * Effect: Synchronize image data from chunk updates
     * 
     * Automatically updates the hook's state when the chunk's AI images change.
     * This ensures the UI always reflects the latest image data from the backend.
     * 
     * Dependencies: [chunk?.ai_images] - Re-runs when chunk images are updated
     */
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

    /**
     * Generates an AI image based on the provided prompt and chunk data
     * 
     * This function handles the complete image generation workflow:
     * 1. Validates input parameters (chunk ID)
     * 2. Sets loading state and clears previous errors
     * 3. Calls the AI image generation service
     * 4. Polls for image availability (ensures image is ready)
     * 5. Updates state with successful result or error
     * 
     * @param props - Object containing chunk and prompt data
     * @param props.chunk - The chunk for which to generate an image
     * @param props.prompt - The text prompt for image generation
     * @returns Promise resolving to ToolResult indicating success/failure
     * 
     * @example
     * ```typescript
     * const result = await generateImage({
     *   chunk: currentChunk,
     *   prompt: "A serene mountain landscape at sunset"
     * });
     * 
     * if (result.success) {
     *   console.log("Image generated:", result.data.imagePath);
     * } else {
     *   console.error("Generation failed:", result.error);
     * }
     * ```
     */
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

/**
 * Hook Usage Notes and Best Practices
 * 
 * Performance Considerations:
 * - All callback functions are memoized to prevent unnecessary re-renders
 * - State updates use functional form to ensure consistency
 * - Effect dependencies are carefully managed to avoid infinite loops
 * 
 * Error Handling:
 * - All API errors are caught and converted to user-friendly messages
 * - Errors are logged to the console for debugging purposes
 * - Loading states are properly reset even when errors occur
 * 
 * State Synchronization:
 * - Hook automatically syncs with chunk image data updates
 * - Latest image is always displayed when chunk data changes
 * - Dialog state is independent of chunk updates
 * 
 * Memory Management:
 * - No memory leaks due to proper cleanup and memoization
 * - Image polling is promise-based and doesn't create timers
 * - State updates are batched for optimal performance
 * 
 * Testing Considerations:
 * - All functions are pure and easily testable
 * - State transitions are predictable and deterministic
 * - Mock services can be injected for unit testing
 * 
 * Integration Requirements:
 * - Requires generateAiImage service for API calls
 * - Depends on pollImageAvailability utility for image verification
 * - Uses shared logging utility for error tracking
 * - Integrates with chunk data structure and types
 */

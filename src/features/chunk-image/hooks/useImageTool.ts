
import { useCallback, useState, useEffect } from 'react';

import { generateImage } from '@services/aiService';
import log from '@utils/logger';
import type { ChunkType, AiImage } from '@mtypes/documents';
import { pollImageAvailability } from '../utils/imagePolling';


/**
 * Get the latest AI-generated image from a list of images
 * Chunks have lists of images, this returns the most recent image.
 * @param ai_images Array of AI-generated images, from a ChunkType.
 * @returns The latest AI-generated image or undefined if not found
 */
function getLatestAiImage(ai_images?: AiImage[]): AiImage | undefined {
    if (!ai_images || ai_images.length === 0) return undefined;
    return ai_images[ai_images.length - 1];
}

export interface ImageToolState {
    loading: boolean;
    error: string | null;
    imagePath: string | null;
    prompt: string;
    dialogOpen: boolean;
}

export interface UseImageToolReturn {
    state: ImageToolState; // loading, error, data, prompt, dialogOpen
    loading: boolean;
    error: string | null;
    hasImage: boolean;
    handleGenerateImage: () => Promise<ImageResult>;
    getImgSrc: () => string; // Returns the complete image source URL
    openDialog: () => void;
    closeDialog: () => void;
    handlePromptChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
/**
 * Result of successful image generation operation
 */
export interface ImageResult {
    /** The relative path to the generated image file */
    imagePath: string | null;
    /** The prompt that was used to generate the image */
    prompt: string;
}



export const useImageTool = (chunk: ChunkType): UseImageToolReturn => {
    // Initialize hook state with default values
    const [state, setState] = useState<ImageToolState>({
        loading: false,      // No operations in progress initially
        error: null,         // No errors on initialization
        imagePath: null,          // No image data initially
        prompt: '',          // Empty prompt initially
        dialogOpen: false,   // Dialog closed initially
    });

    useEffect(() => {
        const aiImage = getLatestAiImage(chunk.images);
        if (aiImage && typeof aiImage.path === 'string') {
            // Update state with latest image data and prompt
            setState(s => ({
                ...s,
                imagePath: aiImage.path ?? null,
                prompt: aiImage.prompt ?? '',
            }));
        } else {
            // Clear state if no valid image exists
            setState(s => ({ ...s, imagePath: null, prompt: '' }));
        }
    }, [chunk?.images]);

    const handleGenerateImage = useCallback(async (): Promise<ImageResult> => {
        // Capture latest prompt at invocation time (prevents stale closure bug)
        const currentPrompt = state.prompt;

        setState(s => ({ ...s, loading: true, error: null }));

        try {
            const result = await generateImage(currentPrompt, chunk.id);

            // Allow longer server-side file flush by extending polling timeout (match API call ~60s)
            const imgUrl = `/${result.path}`;
            try {
                await pollImageAvailability(imgUrl, 20000, 350);
            } catch (pollErr: any) {
                // Polling failure shouldn't mask successful generation; log but continue
                log.warn?.(`Image generated but not yet loadable: ${pollErr?.message}`);
            }

            setState(s => ({
                ...s,
                imagePath: result.path,
                prompt: result.prompt,
                loading: false,
                error: null,
                dialogOpen: false,
            }));

            return { imagePath: result.path, prompt: result.prompt };
        } catch (err: any) {
            // Distinguish between network timeout (ky TimeoutError) and HTTP errors
            let errorMessage = 'Failed to generate image';
            if (err?.name === 'TimeoutError') {
                errorMessage = 'Image generation timed out. Try again or simplify the prompt.';
            } else if (err?.response) {
                // ky HTTPError
                const statusText = err.response.statusText || 'Error';
                errorMessage = `Request failed: ${err.response.status} ${statusText}`;
                try {
                    const data = await err.response.json();
                    if (data?.detail) errorMessage += ` - ${data.detail}`;
                } catch (_) { /* ignore */ }
            } else if (err?.message) {
                errorMessage = err.message;
            }
            log.error(errorMessage);
            setState(s => ({ ...s, error: errorMessage, loading: false }));
            return { imagePath: null, prompt: currentPrompt };
        }
    }, [state.prompt, chunk.id]);


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
    const getImgSrc = useCallback(() => (state.imagePath ? `/${state.imagePath}` : ''), [state.imagePath]);

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
        handleGenerateImage,           // Function to trigger AI image generation
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
        hasImage: Boolean(state.imagePath), // Boolean indicating if image exists
    };
};

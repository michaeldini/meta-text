
import { useCallback, useState, useEffect } from 'react';

import { generateImage } from '@services/aiService';
import log from '@utils/logger';
import type { ChunkType } from '@mtypes/documents';
import { AiImage } from '@mtypes/tools';
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
    selectedId: number | null; // currently selected image id
}

export interface UseImageToolReturn {
    state: ImageToolState; // loading, error, data, prompt, dialogOpen
    loading: boolean;
    error: string | null;
    hasImage: boolean;
    images: AiImage[]; // list of all images
    selected: AiImage | null; // currently selected image entity
    handleGenerateImage: () => Promise<ImageResult>;
    getImgSrc: () => string; // Returns the complete image source URL
    handlePromptChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    setSelectedId: (id: number | null) => void; // select a different image
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
        selectedId: null,
    });

    useEffect(() => {
        // If images list changes, maintain selection if possible, else default to latest
        const images = chunk.images || [];
        if (!images.length) {
            setState(s => ({ ...s, imagePath: null, prompt: '', selectedId: null }));
            return;
        }
        const currentSelected = images.find(img => img.id === state.selectedId);
        const fallback = getLatestAiImage(images);
        const active = currentSelected || fallback;
        if (active) {
            setState(s => ({
                ...s,
                selectedId: active.id,
                imagePath: active.path ?? null,
                prompt: active.prompt ?? '',
            }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
            } catch (pollErr: unknown) {
                // Polling failure shouldn't mask successful generation; log but continue
                let msg = String(pollErr ?? 'polling error');
                if (pollErr && typeof pollErr === 'object' && 'message' in pollErr) {
                    try { msg = String((pollErr as { message?: unknown }).message ?? msg); } catch { /* ignore */ }
                }
                log.warn?.(`Image generated but not yet loadable: ${msg}`);
            }

            setState(s => ({
                ...s,
                imagePath: result.path,
                prompt: result.prompt,
                loading: false,
                error: null,
                selectedId: result?.id ?? s.selectedId, // NOTE: generateImage currently returns path + prompt; if id returned later, capture it
            }));

            return { imagePath: result.path, prompt: result.prompt };
        } catch (err: unknown) {
            // Distinguish between network timeout (ky TimeoutError) and HTTP errors
            let errorMessage = 'Failed to generate image';
            // try to safely inspect known shapes
            const e = err as { name?: string; response?: Response; message?: unknown } | null;
            if (e?.name === 'TimeoutError') {
                errorMessage = 'Image generation timed out. Try again or simplify the prompt.';
            } else if (e?.response) {
                const statusText = e.response.statusText || 'Error';
                errorMessage = `Request failed: ${e.response.status} ${statusText}`;
                try {
                    const data = await e.response.json();
                    if (data && typeof data === 'object' && 'detail' in data) {
                        try { errorMessage += ` - ${String((data as { detail?: unknown }).detail ?? '')}`; } catch { /* ignore inner */ }
                    }
                } catch (parseErr) { if (parseErr) { /* parse failed */ } }
            } else if (e?.message) {
                errorMessage = String(e.message);
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
     * Handles prompt input changes in the generation dialog
     * @param e - React change event from the prompt input field
     */
    const handlePromptChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) =>
        setState(s => ({ ...s, prompt: e.target.value })), []);

    /**
     * Sets currently selected image id and updates displayed image data
     */
    const setSelectedId = useCallback((id: number | null) => {
        if (id === null) {
            setState(s => ({ ...s, selectedId: null, imagePath: null }));
            return;
        }
        const img = chunk.images?.find(i => i.id === id);
        if (img) {
            setState(s => ({
                ...s,
                selectedId: id,
                imagePath: img.path ?? null,
                prompt: img.prompt ?? s.prompt,
            }));
        }
    }, [chunk.images]);

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
        // Visibility handled by global drawer store
        handlePromptChange,     // Handles prompt input changes
        setSelectedId,

        // Convenience state accessors (duplicated for easier access)
        loading: state.loading, // Boolean indicating generation in progress
        error: state.error,     // Current error message (null if no error)
        hasImage: Boolean(state.imagePath), // Boolean indicating if image exists
        images: chunk.images || [],
        selected: chunk.images?.find(i => i.id === state.selectedId) || null,
    };
};

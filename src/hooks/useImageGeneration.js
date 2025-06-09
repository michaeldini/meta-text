import { useState, useEffect, useCallback } from 'react';
import { generateAiImage } from '../services/aiService';
import { fetchChunk } from '../services/chunkService';

/**
 * useImageGeneration - manages all image-related state and logic for Chunk
 * @param {object} chunk - chunk object
 */
export function useImageGeneration(chunk) {
    const [state, setState] = useState({
        dialogOpen: false,
        loading: false,
        error: null,
        data: null,
        prompt: '',
        loaded: false,
        lightboxOpen: false,
    });

    // Sync image data from chunk
    useEffect(() => {
        if (chunk.ai_image && chunk.ai_image.path) {
            setState(s => ({
                ...s,
                data: chunk.ai_image.path,
                prompt: chunk.ai_image.prompt || '',
            }));
        } else {
            setState(s => ({ ...s, data: null }));
        }
    }, [chunk.ai_image]);

    // Reset loaded when data changes
    useEffect(() => {
        setState(s => ({ ...s, loaded: false }));
    }, [state.data]);

    const getImgSrc = useCallback(() => (state.data ? `/${state.data}` : ''), [state.data]);

    const openDialog = useCallback(() => setState(s => ({ ...s, dialogOpen: true, error: null })), []);
    const closeDialog = useCallback(() => setState(s => ({ ...s, dialogOpen: false, error: null })), []);
    const setLightboxOpen = useCallback((open) => setState(s => ({ ...s, lightboxOpen: open })), []);
    const setImageLoaded = useCallback((loaded) => setState(s => ({ ...s, loaded })), []);

    const handleGenerate = useCallback(async (prompt, chunkId) => {
        setState(s => ({ ...s, loading: true, error: null, prompt, dialogOpen: false }));
        try {
            console.log('Generating image with prompt:', prompt, 'for chunk ID:', chunkId);
            const result = await generateAiImage(prompt, chunkId);
            const updatedChunk = await fetchChunk(chunkId);
            let imagePath = null;
            let imagePrompt = prompt;
            if (updatedChunk && updatedChunk.ai_image && updatedChunk.ai_image.path) {
                imagePath = updatedChunk.ai_image.path;
                imagePrompt = updatedChunk.ai_image.prompt || prompt;
            } else if (result && result.path) {
                imagePath = result.path;
            }
            if (imagePath && imagePath.startsWith('/')) {
                imagePath = imagePath.slice(1);
            }
            if (imagePath) {
                setTimeout(() => {
                    setState(s => ({
                        ...s,
                        data: imagePath,
                        prompt: imagePrompt,
                        loading: false,
                        error: null,
                    }));
                }, 300); // 300ms delay to allow image to be available
            } else {
                setState(s => ({
                    ...s,
                    data: imagePath,
                    prompt: imagePrompt,
                    loading: false,
                    error: null,
                }));
            }
        } catch (err) {
            setState(s => ({ ...s, error: err?.message || 'Failed to generate image', loading: false }));
        }
    }, []);

    return {
        imageState: state,
        getImgSrc,
        openDialog,
        closeDialog,
        handleGenerate,
        setLightboxOpen,
        setImageLoaded,
    };
}

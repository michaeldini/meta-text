import { useCallback, useState, useEffect } from 'react';

import { generateAiImage } from 'services';
import { log } from 'utils';
import type { ChunkType, AiImage } from 'types';

import { ImageToolProps, ToolResult } from '../types';

interface ImageResult {
    imagePath: string;
    prompt: string;
}

interface ImageToolState {
    loading: boolean;
    error: string | null;
    data: string | null;
    prompt: string;
    loaded: boolean;
    lightboxOpen: boolean;
    dialogOpen: boolean;
}

function getLatestAiImage(ai_images?: AiImage[]): AiImage | undefined {
    if (!ai_images || ai_images.length === 0) return undefined;
    return ai_images[ai_images.length - 1];
}

/**
 * Hook for image tool functionality
 */
export const useImageTool = (chunk?: ChunkType) => {
    const [state, setState] = useState<ImageToolState>({
        loading: false,
        error: null,
        data: null,
        prompt: '',
        loaded: false,
        lightboxOpen: false,
        dialogOpen: false,
    });

    // Sync image data from chunk
    useEffect(() => {
        if (!chunk) return;

        const aiImage = getLatestAiImage(chunk.ai_images);
        if (aiImage && typeof aiImage.path === 'string') {
            setState(s => ({
                ...s,
                data: aiImage.path ?? null,
                prompt: aiImage.prompt ?? '',
            }));
        } else {
            setState(s => ({ ...s, data: null, prompt: '' }));
        }
    }, [chunk?.ai_images]);

    // Reset loaded when data changes
    useEffect(() => {
        setState(s => ({ ...s, loaded: false }));
    }, [state.data]);

    const generateImage = useCallback(async (props: ImageToolProps): Promise<ToolResult<ImageResult>> => {
        const { prompt = '', chunk } = props;

        if (!chunk?.id || typeof chunk.id !== 'number') {
            return {
                success: false,
                error: 'Invalid chunk ID'
            };
        }

        setState(s => ({ ...s, loading: true, error: null }));

        try {
            const result = await generateAiImage(prompt, chunk.id);

            // Poll for image availability
            const pollImage = (url: string, timeout = 10000, interval = 300) =>
                new Promise<void>((resolve, reject) => {
                    const start = Date.now();
                    const check = () => {
                        const img = new window.Image();
                        img.onload = () => resolve();
                        img.onerror = () => {
                            if (Date.now() - start >= timeout) {
                                reject(new Error('Timed out waiting for image to be available'));
                            } else {
                                setTimeout(check, interval);
                            }
                        };
                        img.src = url + '?cacheBust=' + Date.now();
                    };
                    check();
                });

            const imgUrl = `/${result.path}`;
            await pollImage(imgUrl, 10000, 300);

            setState(s => ({
                ...s,
                data: result.path,
                prompt: result.prompt,
                loading: false,
                error: null,
                dialogOpen: false,
            }));

            return {
                success: true,
                data: {
                    imagePath: result.path,
                    prompt: result.prompt
                }
            };
        } catch (err: any) {
            const errorMessage = err?.message || 'Failed to generate image';
            log.error(errorMessage);
            setState(s => ({ ...s, error: errorMessage, loading: false }));

            return {
                success: false,
                error: errorMessage
            };
        }
    }, []);

    // Helper functions
    const getImgSrc = useCallback(() => (state.data ? `/${state.data}` : ''), [state.data]);
    const setLightboxOpen = useCallback((open: boolean) => setState(s => ({ ...s, lightboxOpen: open })), []);
    const setImageLoaded = useCallback((loaded: boolean) => setState(s => ({ ...s, loaded })), []);
    const openDialog = useCallback(() => setState(s => ({ ...s, dialogOpen: true, error: null, prompt: '' })), []);
    const closeDialog = useCallback(() => setState(s => ({ ...s, dialogOpen: false, error: null, prompt: '' })), []);
    const handlePromptChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setState(s => ({ ...s, prompt: e.target.value })), []);

    return {
        generateImage,
        state,
        getImgSrc,
        setLightboxOpen,
        setImageLoaded,
        openDialog,
        closeDialog,
        handlePromptChange,
        loading: state.loading,
        error: state.error
    };
};

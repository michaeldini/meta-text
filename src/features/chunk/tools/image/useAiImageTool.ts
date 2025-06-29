import { useState, useCallback, useEffect } from 'react';
import { generateAiImage } from '../../../../services/aiService';
import log from '../../../../utils/logger';
import type { Chunk, AiImage } from '../../../../types/chunk';

interface AiImageToolState {
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
    // Optionally, sort by id or createdAt if available
    return ai_images[ai_images.length - 1];
}

export function useAiImageTool(chunk: Chunk) {
    const [state, setState] = useState<AiImageToolState>({
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
    }, [chunk.ai_images]);

    // Reset loaded when data changes
    useEffect(() => {
        setState(s => ({ ...s, loaded: false }));
    }, [state.data]);

    const getImgSrc = useCallback(() => (state.data ? `/${state.data}` : ''), [state.data]);

    const setLightboxOpen = useCallback((open: boolean) => setState(s => ({ ...s, lightboxOpen: open })), []);
    const setImageLoaded = useCallback((loaded: boolean) => setState(s => ({ ...s, loaded })), []);

    // Dialog handlers
    const openDialog = useCallback(() => setState(s => ({ ...s, dialogOpen: true, error: null, prompt: '' })), []);
    const closeDialog = useCallback(() => setState(s => ({ ...s, dialogOpen: false, error: null, prompt: '' })), []);
    const handlePromptChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setState(s => ({ ...s, prompt: e.target.value })), []);

    // Image generation handler
    const handleDialogSubmit = useCallback(async () => {
        setState(s => ({ ...s, loading: true, error: null }));
        try {
            const result = await generateAiImage(state.prompt, chunk.id);
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
        } catch (err: any) {
            log.error(err?.message || 'Failed to generate image');
            setState(s => ({ ...s, error: err?.message || 'Failed to generate image', loading: false }));
        }
    }, [chunk.id, state.prompt]);

    return {
        state,
        getImgSrc,
        setLightboxOpen,
        setImageLoaded,
        openDialog,
        closeDialog,
        handlePromptChange,
        handleDialogSubmit,
    };
}

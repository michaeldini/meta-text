import { useCallback } from 'react';
import { generateAiImage } from '../../../../services/aiService';
import log from '../../../../utils/logger';
import { useImageGenerationDialog } from './useImageGenerationDialog';
import type { Chunk } from '../../../../types/chunk';

interface ImageGenState {
    loading: boolean;
    error: string | null;
    data: string | null;
    prompt: string;
    loaded: boolean;
    lightboxOpen: boolean;
}

type SetImageState = React.Dispatch<React.SetStateAction<ImageGenState>>;

export function useImageGenerationHandler(
    chunk: Chunk,
    setImageState: SetImageState
) {
    const dialog = useImageGenerationDialog();

    // Handles dialog submit and image polling
    const handleDialogSubmit = useCallback(async (prompt: string) => {
        dialog.setLoading(true);
        dialog.setError(null);
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
                        img.src = url + '?cacheBust=' + Date.now(); // prevent caching
                    };
                    check();
                });
            const imgUrl = `/${result.path}`;
            await pollImage(imgUrl, 10000, 300);
            setImageState((s: ImageGenState) => ({
                ...s,
                data: result.path,
                prompt: result.prompt,
                loading: false,
                error: null,
            }));
            dialog.closeDialog();
        } catch (err: any) {
            dialog.setError(err?.message || 'Failed to generate image');
            dialog.setLoading(false);
        }
    }, [chunk.id, setImageState, dialog]);

    // Logging side effects
    const logImageState = useCallback((imageState: ImageGenState) => {
        if (imageState.loading) log.info(`Image generation started for chunk id: ${chunk.id}`);
        if (imageState.error) log.error(`Image generation error for chunk id: ${chunk.id}:`, imageState.error);
        if (imageState.data) log.info(`Image retrieved for chunk id: ${chunk.id}`);
    }, [chunk.id]);

    return { dialog, handleDialogSubmit, logImageState };
}

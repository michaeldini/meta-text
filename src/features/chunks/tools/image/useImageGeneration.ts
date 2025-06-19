import { useState, useEffect, useCallback } from 'react';
import { generateAiImage } from '../../../../services/aiService';
import { fetchChunk } from '../../../../services/chunkService';

interface Chunk {
    id: number;
    ai_image?: {
        path?: string;
        prompt?: string;
    } | null;
    [key: string]: any;
}

interface ImageGenState {
    dialogOpen: boolean;
    loading: boolean;
    error: string | null;
    data: string | null;
    prompt: string;
    loaded: boolean;
    lightboxOpen: boolean;
}

export function useImageGeneration(chunk: Chunk) {
    const [state, setState] = useState<ImageGenState>({
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
        const aiImage = chunk.ai_image;
        if (aiImage && typeof aiImage.path === 'string') {
            setState(s => ({
                ...s,
                data: aiImage.path ?? null,
                prompt: aiImage.prompt ?? '',
            }));
        } else {
            setState(s => ({ ...s, data: null, prompt: '' }));
        }
    }, [chunk.ai_image]);

    // Reset loaded when data changes
    useEffect(() => {
        setState(s => ({ ...s, loaded: false }));
    }, [state.data]);

    const getImgSrc = useCallback(() => (state.data ? `/${state.data}` : ''), [state.data]);

    const openDialog = useCallback(() => setState(s => ({ ...s, dialogOpen: true, error: null })), []);
    // ...existing code continues...
    return { state, setState, getImgSrc, openDialog };
}

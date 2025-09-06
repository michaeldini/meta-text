/**
 * useRewriteTool Hook (simplified)
 *
 * Responsibilities:
 * - Hold local style input only.
 * - Create a rewrite via mutation.
 * - Invalidate chunk/metatext queries so rewrites refresh from server.
 * - Do not keep a local rewrites list or selection.
 */
import { useCallback, useMemo, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { generateRewrite } from '@services/aiService';
import type { ChunkType } from '@mtypes/documents';
import type { Rewrite } from '@mtypes/tools';
import { queryKeys } from '@services/queryKeys';

export interface UseRewriteToolReturn {
    rewrites: Rewrite[];
    style: string;
    setStyle: (val: string) => void;
    submitRewrite: () => Promise<Rewrite | null>;
    isLoading: boolean;
    error: string | null;
    hasRewrites: boolean;
}

const DEFAULT_STYLE = "like im 5";

export const useRewriteTool = (chunk: ChunkType | null): UseRewriteToolReturn => {
    const rewrites = useMemo(() => chunk?.rewrites ?? [], [chunk?.rewrites]);
    const [style, setStyle] = useState<string>(DEFAULT_STYLE);
    const [error, setError] = useState<string | null>(null);
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async () => {
            if (!chunk) throw new Error('No chunk selected');
            return generateRewrite(chunk.id, style);
        },
        onSuccess: () => {
            // Invalidate queries so the latest chunk.rewrites is fetched
            if (chunk) {
                queryClient.invalidateQueries({ queryKey: queryKeys.chunk(chunk.id) });
                if (typeof chunk.metatext_id === 'number') {
                    queryClient.invalidateQueries({ queryKey: queryKeys.metatextDetail(chunk.metatext_id) });
                    // queryClient.invalidateQueries({ queryKey: queryKeys.chunks(chunk.metatext_id) });
                }
            }
            // Reset style and clear error to simplify UX
            setStyle(DEFAULT_STYLE);
            setError(null);
        },
        onError: (err: unknown) => {
            const e = err as { message?: unknown } | null;
            const message = e && e.message ? String(e.message) : 'Failed to generate rewrite';
            setError(message);
        },
    });

    const submitRewrite = useCallback(async (): Promise<Rewrite | null> => {
        if (!chunk) return null;
        try {
            const res = await mutation.mutateAsync();
            return res;
        } catch {
            return null;
        }
    }, [chunk, mutation]);

    return {
        rewrites,
        style,
        setStyle,
        submitRewrite,
        isLoading: mutation.isPending,
        error,
        hasRewrites: rewrites.length > 0,
    };
};

export default useRewriteTool;

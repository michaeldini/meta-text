/**
 * useRewriteTool Hook
 *
 * Provides a cohesive API for the Rewrite tool similar to useImageTool.
 * Manages dialog visibility, style selection, submission lifecycle, existing rewrite selection,
 * and error/loading flags. Consumes rewrites directly from the provided chunk.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { generateRewrite } from '@services/aiService';
import type { ChunkType } from '@mtypes/documents';
import { Rewrite } from '@mtypes/tools'

export interface RewriteToolState {
    dialogOpen: boolean;
    loading: boolean;
    error: string | null;
    style: string;
    selectedId: number | '';
}

export interface UseRewriteToolReturn {
    state: RewriteToolState;
    rewrites: Rewrite[];
    selected: Rewrite | undefined;
    loading: boolean;
    error: string | null;
    openDialog: () => void;
    closeDialog: () => void;
    setStyle: (val: string) => void;
    submitRewrite: () => Promise<Rewrite | null>;
    setSelectedId: (id: number | '') => void;
    hasRewrites: boolean;
}

const DEFAULT_STYLE = 'like im 5';

export const useRewriteTool = (chunk: ChunkType | null): UseRewriteToolReturn => {
    const incomingRewrites = useMemo(() => chunk?.rewrites ?? [], [chunk?.rewrites]);

    const [state, setState] = useState<RewriteToolState>({
        dialogOpen: false,
        loading: false,
        error: null,
        style: DEFAULT_STYLE,
        selectedId: ''
    });

    // Maintain local rewrites so we can append newly created ones without full page refresh.
    const [localRewrites, setLocalRewrites] = useState<Rewrite[]>(incomingRewrites);

    // Merge in new rewrites from chunk (server source of truth) while preserving any locally added ones.
    useEffect(() => {
        setLocalRewrites(prev => {
            if (!incomingRewrites.length) return prev.length ? prev : [];
            const map = new Map<number, Rewrite>();
            // Server rewrites preferred (overwrite optimistic if same id)
            for (const r of incomingRewrites) map.set(r.id, r);
            // Add any local rewrites not yet on server list (should be rare since server returns created one)
            for (const r of prev) if (!map.has(r.id)) map.set(r.id, r);
            // Preserve original ordering: newest first (assuming higher id newer)
            return Array.from(map.values()).sort((a, b) => b.id - a.id);
        });
    }, [chunk?.id, incomingRewrites]);

    // Ensure a selected rewrite exists
    useEffect(() => {
        setState(s => {
            if (!localRewrites.length) return { ...s, selectedId: '' };
            if (s.selectedId && localRewrites.find(r => r.id === s.selectedId)) return s;
            return { ...s, selectedId: localRewrites[0].id };
        });
    }, [localRewrites]);

    const openDialog = useCallback(() => {
        setState(s => ({ ...s, dialogOpen: true, error: null, style: DEFAULT_STYLE }));
    }, []);

    const closeDialog = useCallback(() => {
        setState(s => ({ ...s, dialogOpen: false, error: null, style: DEFAULT_STYLE }));
    }, []);

    const setStyle = useCallback((val: string) => {
        setState(s => ({ ...s, style: val }));
    }, []);

    const setSelectedId = useCallback((id: number | '') => {
        setState(s => ({ ...s, selectedId: id }));
    }, []);

    const submitRewrite = useCallback(async (): Promise<Rewrite | null> => {
        if (!chunk) return null;
        const currentStyle = state.style;
        setState(s => ({ ...s, loading: true, error: null }));
        try {
            const rewrite = await generateRewrite(chunk.id, currentStyle);
            // Insert new rewrite at top (newest first) if not already present
            setLocalRewrites(prev => {
                if (prev.find(r => r.id === rewrite.id)) return prev; // already merged
                return [rewrite, ...prev];
            });
            setState(s => ({
                ...s,
                loading: false,
                dialogOpen: false,
                error: null,
                selectedId: rewrite.id
            }));
            return rewrite;
        } catch (err: unknown) {
            const e = err as { message?: unknown } | null;
            const message = e && e.message ? String(e.message) : 'Failed to generate rewrite';
            setState(s => ({ ...s, loading: false, error: message }));
            return null;
        }
    }, [chunk, state.style]);

    const selected = localRewrites.find(r => r.id === state.selectedId);

    return {
        state,
        rewrites: localRewrites,
        selected,
        loading: state.loading,
        error: state.error,
        openDialog,
        closeDialog,
        setStyle,
        submitRewrite,
        setSelectedId,
        hasRewrites: localRewrites.length > 0
    };
};

export default useRewriteTool;

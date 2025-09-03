/**
 * Hook: useChunkFavoriteToggle
 * Encapsulates loading state and toggle logic for favoriting/unfavoriting a chunk.
 */
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { ChunkType } from '@mtypes/documents';
import { favoriteChunk, unfavoriteChunk } from '@services/chunkService';

export function useChunkFavoriteToggle(chunk: ChunkType) {
    const [loading, setLoading] = useState(false);
    const queryClient = useQueryClient();
    const metatextId = chunk.metatext_id;
    const favorited = !!chunk.favorited_by_user_id;

    const toggle = async () => {
        setLoading(true);
        try {
            if (favorited) {
                await unfavoriteChunk(chunk.id);
            } else {
                await favoriteChunk(chunk.id);
            }
            // Invalidate cache so UI updates immediately
            queryClient.invalidateQueries({ queryKey: ['metatextDetail', metatextId] });
        } catch {
            // swallow for now; component can show errors if desired
        } finally {
            setLoading(false);
        }
    };

    return { loading, favorited, toggle };
}

export default useChunkFavoriteToggle;

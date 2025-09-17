import type { ChunkType } from '@mtypes/documents';

export function useChunkFilters(chunks: ChunkType[], showOnlyFavorites: boolean) {
    if (!chunks || chunks.length === 0) return { filtered: [] as ChunkType[] };
    if (!showOnlyFavorites) return { filtered: chunks };
    const filtered = chunks.filter((c) => !!c.favorited_by_user_id);
    return { filtered };
}

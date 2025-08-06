/**
 * useChunksQuery
 * Fetches chunk data using React Query and updates Zustand chunk state on success.
 * Temporary hybrid: keeps Zustand in sync until full migration.
 */

import React from 'react';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { fetchChunks } from '@services/chunkService';
import type { ChunkType } from '@mtypes/documents';

export function useChunksQuery(metatextId: number) {

    const query = useQuery<ChunkType[], Error>({
        queryKey: ['chunks', metatextId],
        queryFn: async () => {
            return await fetchChunks(metatextId);
        },
    });

    // Sync Zustand chunk state when query data changes
    // React.useEffect(() => {
    //     if (query.data) {
    //         setChunks(query.data);
    //     }
    // }, [query.data, setChunks]);

    return query;
}
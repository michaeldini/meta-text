// React Query hook for fetching a single metatext detail
// Replaces Zustand store logic for metatext detail state management

import { useQuery } from '@tanstack/react-query';
import { fetchMetatext } from 'services/metatextService';
import type { MetatextDetail } from 'types';

/**
 * useMetatextDetail
 * Fetches and caches a single metatext detail by ID using React Query.
 *
 * @param id - The metatext ID to fetch
 * @returns { data, isLoading, error, refetch }
 */
export function useMetatextDetail(id: number | null) {
    return useQuery<MetatextDetail>({
        queryKey: ['metatextDetail', id],
        queryFn: async () => {
            if (id == null) throw new Error('No metatext ID provided');
            return fetchMetatext(id);
        },
        enabled: id != null,
        retry: 1,
        staleTime: 1000 * 60, // 1 minute
    });
}

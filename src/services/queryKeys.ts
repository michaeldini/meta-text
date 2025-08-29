// Centralized React Query keys for consistent cache invalidation
// Keep these tiny helpers to avoid ad-hoc strings across features

export const queryKeys = {
    metatextDetail: (metatextId: number) => ['metatextDetail', metatextId] as const,
    chunks: (metatextId: number) => ['chunks', metatextId] as const,
    chunk: (chunkId: number) => ['chunk', chunkId] as const,
};

export type QueryKey = ReturnType<(typeof queryKeys)[keyof typeof queryKeys]>;

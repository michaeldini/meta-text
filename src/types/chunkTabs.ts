// Centralized list of available chunk tabs and type
export const CHUNK_TABS = [
    'comparison',
    'ai-image',
    'notes-summary',
    'compression',
    'explanation',
] as const;

export type ChunkTab = typeof CHUNK_TABS[number];

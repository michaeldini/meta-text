import { useEffect, useState } from 'react';
import type { ChunkType } from '@mtypes/documents';
import log from '@utils/logger';

export function useChunkSearch(chunks: ChunkType[] | undefined, query: string, debounceMs = 300) {
    const [results, setResults] = useState<ChunkType[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        if (!chunks || chunks.length === 0) {
            setResults([]);
            setIsSearching(false);
            return;
        }

        if (query.length < 2) {
            setResults([]);
            setIsSearching(false);
            return;
        }

        setIsSearching(true);
        const timeout = setTimeout(() => {
            const searchTermLower = query.toLowerCase();
            const matching: ChunkType[] = [];
            log.info(`Searching for "${query}" in ${chunks.length} chunks`);
            for (const chunk of chunks) {
                const chunkText = chunk.text || '';
                if (chunkText.toLowerCase().includes(searchTermLower)) {
                    matching.push(chunk);
                }
            }
            setResults(matching);
            setIsSearching(false);
            log.info(`Search completed: ${matching.length} chunks found`);
        }, debounceMs);

        return () => {
            clearTimeout(timeout);
            setIsSearching(false);
        };
    }, [chunks, query, debounceMs]);

    return { results, isSearching };
}

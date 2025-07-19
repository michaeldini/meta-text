import { useEffect, useState } from 'react';
import type { Rewrite, ChunkType } from 'types';
import type { UseCompressionReturn } from 'features/chunk-shared/types';

export const useCompression = (chunk: ChunkType | null): UseCompressionReturn => {
    const [selectedId, setSelectedId] = useState<number | ''>('');

    // Get compressions directly from chunk data
    const compressions = chunk?.rewrites || [];

    // Reset selectedId when chunk changes and set to first compression if available
    useEffect(() => {
        if (!chunk || compressions.length === 0) {
            setSelectedId('');
        } else {
            setSelectedId(compressions[0].id);
        }
    }, [chunk, compressions]);

    // Placeholder function for compatibility - actual refetching is handled by the parent component
    const onCompressionCreated = () => {
        // The parent component (CompressionDisplayTool) handles the actual refetch
        // This function is kept for interface compatibility
    };

    const selected = compressions.find(c => c.id === selectedId);

    return {
        compressions,
        selectedId,
        loading: false, // No loading needed since data comes from chunk
        error: null, // No error handling needed since data comes from chunk
        selected,
        setSelectedId,
        onCompressionCreated
    };
};

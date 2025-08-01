import { useEffect, useState } from 'react';
import type { ChunkType } from '@mtypes/documents';
import type { UseRewriteReturn } from '@features/chunk-shared';

export const useRewrite = (chunk: ChunkType | null): UseRewriteReturn => {
    const [selectedId, setSelectedId] = useState<number | ''>('');

    // Get rewrites directly from chunk data
    const rewrites = chunk?.rewrites || [];

    // Reset selectedId when chunk changes and set to first rewrite if available
    useEffect(() => {
        if (!chunk || rewrites.length === 0) {
            setSelectedId('');
        } else {
            setSelectedId(rewrites[0].id);
        }
    }, [chunk, rewrites]);

    // Placeholder function for compatibility - actual refetching is handled by the parent component
    const onRewriteCreated = () => {
        // The parent component (CompressionDisplayTool) handles the actual refetch
        // This function is kept for interface compatibility
    };

    const selected = rewrites.find(c => c.id === selectedId);

    return {
        rewrites: rewrites,
        selectedId,
        loading: false, // No loading needed since data comes from chunk
        error: null, // No error handling needed since data comes from chunk
        selected,
        setSelectedId,
        onRewriteCreated
    };
};

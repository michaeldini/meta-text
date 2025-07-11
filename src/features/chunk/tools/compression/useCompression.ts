import { useEffect, useState } from 'react';
import { fetchChunkCompressions } from 'services';
import type { ChunkCompression, ChunkType } from 'types';
import type { UseCompressionReturn } from '../types';

export const useCompression = (chunk: ChunkType | null): UseCompressionReturn => {
    const [compressions, setCompressions] = useState<ChunkCompression[]>([]);
    const [selectedId, setSelectedId] = useState<number | ''>('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Reset state when chunk changes
    useEffect(() => {
        if (!chunk) {
            setCompressions([]);
            setSelectedId('');
            return;
        }
        onCompressionCreated();
    }, [chunk]);

    const onCompressionCreated = () => {
        if (!chunk) return;

        setLoading(true);
        setError(null);

        fetchChunkCompressions(chunk.id)
            .then(data => {
                setCompressions(data);
                setSelectedId(data.length > 0 ? data[0].id : '');
            })
            .catch(() => setError('Failed to load compressions.'))
            .finally(() => setLoading(false));
    };

    const selected = compressions.find(c => c.id === selectedId);

    return {
        compressions,
        selectedId,
        loading,
        error,
        selected,
        setSelectedId,
        onCompressionCreated
    };
};

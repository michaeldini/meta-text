import React, { useCallback } from 'react';
import ChunkComparison from '../comparison/ChunkComparison';
import type { Chunk } from '../../../../types/chunk';
import type { ChunkFieldValue } from '../../../../store/chunkStore';

interface ComparisonTabProps {
    chunk: Chunk;
    updateChunkField: (chunkId: number, field: keyof Chunk, value: ChunkFieldValue) => void;
}

const ComparisonTab: React.FC<ComparisonTabProps> = ({ chunk, updateChunkField }) => {
    const handleComparisonUpdate = useCallback(
        (newComparison: string) => updateChunkField(chunk.id, 'comparison', newComparison),
        [chunk.id, updateChunkField]
    );

    return (
        <ChunkComparison
            chunkId={chunk.id}
            comparisonText={chunk.comparison}
            onComparisonUpdate={handleComparisonUpdate}
        />
    );
};

export default ComparisonTab;

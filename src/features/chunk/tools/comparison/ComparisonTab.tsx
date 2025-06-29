import React, { useCallback } from 'react';
import ComparisonTool from '../../tools/comparison/ComparisonTool';
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
        <ComparisonTool
            chunkIdx={chunk.id}
            chunk={chunk}
            comparisonText={chunk.comparison}
            onComparisonUpdate={handleComparisonUpdate}
        />
    );
};

export default ComparisonTab;

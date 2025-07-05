import React, { useCallback } from 'react';
import ComparisonTool from '../../tools/comparison/ComparisonTool';
import type { ChunkType, UpdateChunkFieldFn } from 'types';

interface ComparisonTabProps {
    chunk: ChunkType;
    updateChunkField: UpdateChunkFieldFn;
}

const ComparisonTab: React.FC<ComparisonTabProps> = ({ chunk, updateChunkField }) => {
    const handleComparisonUpdate = useCallback(
        (newComparison: string) => updateChunkField(chunk.id, 'comparison', newComparison),
        [chunk.id, updateChunkField]
    );

    return (
        <ComparisonTool
            chunk={chunk}
            comparisonText={chunk.comparison}
            onComparisonUpdate={handleComparisonUpdate}
        />
    );
};

export default ComparisonTab;

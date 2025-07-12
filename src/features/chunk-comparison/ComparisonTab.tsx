import React, { useCallback } from 'react';
import ComparisonTool from './ComparisonTool';
import { SimpleTabProps } from 'features/chunk-shared/types';

const ComparisonTab: React.FC<SimpleTabProps> = ({ chunk, updateChunkField }) => {
    const handleComparisonUpdate = useCallback(
        (newComparison: string) => updateChunkField(chunk.id, 'comparison', newComparison),
        [chunk.id, updateChunkField]
    );

    return (
        <ComparisonTool
            chunk={chunk}
            onComparisonUpdate={handleComparisonUpdate}
        />
    );
};

export default ComparisonTab;

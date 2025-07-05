import React, { useCallback } from 'react';
import ComparisonTool from '../../tools/comparison/ComparisonTool';
import { SimpleTabProps } from '../types';

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

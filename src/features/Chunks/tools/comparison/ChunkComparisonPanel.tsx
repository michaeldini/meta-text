import React from 'react';
import ChunkComparison from './ChunkComparison';

interface ChunkComparisonPanelProps {
    chunkId: number;
    comparisonText: string;
    onComparisonUpdate: (newComparison: string) => void;
}

const ChunkComparisonPanel: React.FC<ChunkComparisonPanelProps> = ({ chunkId, comparisonText, onComparisonUpdate }) => (
    <ChunkComparison
        chunkId={chunkId}
        comparisonText={comparisonText}
        onComparisonUpdate={onComparisonUpdate}
    />
);

export default ChunkComparisonPanel;

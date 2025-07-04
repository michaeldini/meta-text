import type { ChunkType } from 'types';
import type { ChunkFieldValue } from 'types';
import ChunkExplanationTool from './ChunkExplanationTool';

interface ExplanationTabProps {
    chunk: ChunkType;
    updateChunkField: (chunkId: number, field: keyof ChunkType, value: ChunkFieldValue) => void;
}

const ExplanationTab: React.FC<ExplanationTabProps> = ({ chunk, updateChunkField }) => {
    const handleExplanationUpdate = (newExplanation: string) =>
        updateChunkField(chunk.id, 'explanation', newExplanation);

    return (
        <ChunkExplanationTool
            chunk={chunk}
            explanationText={chunk.explanation}
            onExplanationUpdate={handleExplanationUpdate}
        />
    );
};

export default ExplanationTab;

import type { Chunk } from '../../../../types/chunk';
import type { ChunkFieldValue } from '../../../../store/chunkStore';
import ExplanationTool from './ExplanationTool';

interface ExplanationTabProps {
    chunk: Chunk;
    updateChunkField: (chunkId: number, field: keyof Chunk, value: ChunkFieldValue) => void;
}

const ExplanationTab: React.FC<ExplanationTabProps> = ({ chunk, updateChunkField }) => {
    const handleExplanationUpdate = (newExplanation: string) =>
        updateChunkField(chunk.id, 'explanation', newExplanation);

    return (
        <ExplanationTool
            chunkIdx={chunk.id}
            chunk={chunk}
            explanationText={chunk.explanation}
            onExplanationUpdate={handleExplanationUpdate}
        />
    );
};

export default ExplanationTab;

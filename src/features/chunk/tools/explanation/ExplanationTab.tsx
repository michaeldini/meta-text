import type { Chunk } from '../../../../types/chunk';
import type { ChunkFieldValue } from '../../../../store/chunkStore';
import ChunkExplanationTool from './ChunkExplanationTool';

interface ExplanationTabProps {
    chunk: Chunk;
    updateChunkField: (chunkId: number, field: keyof Chunk, value: ChunkFieldValue) => void;
}

const ExplanationTab: React.FC<ExplanationTabProps> = ({ chunk, updateChunkField }) => {
    const handleExplanationUpdate = (newExplanation: string) =>
        updateChunkField(chunk.id, 'explanation', newExplanation);

    return (
        <ChunkExplanationTool
            chunkIdx={chunk.id}
            chunk={chunk}
            explanationText={chunk.explanation}
            onExplanationUpdate={handleExplanationUpdate}
        />
    );
};

export default ExplanationTab;

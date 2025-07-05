import type { ChunkType } from 'types';
import type { UpdateChunkFieldFn } from 'types';
import ChunkExplanationTool from './ChunkExplanationTool';

interface ExplanationTabProps {
    chunk: ChunkType;
    updateChunkField: UpdateChunkFieldFn
}

const ExplanationTab: React.FC<ExplanationTabProps> = ({ chunk, updateChunkField }) => {
    const handleExplanationUpdate = (newExplanation: string) =>
        updateChunkField(chunk.id, 'explanation', newExplanation);

    return (
        <ChunkExplanationTool
            chunk={chunk}
            onExplanationUpdate={handleExplanationUpdate}
        />
    );
};

export default ExplanationTab;

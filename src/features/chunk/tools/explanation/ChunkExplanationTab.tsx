import type { ChunkType } from 'types';
import type { UpdateChunkFieldFn } from 'types';
import ChunkExplanationTool from './ChunkExplanationTool';
import { SimpleTabProps } from '../types';


const ExplanationTab: React.FC<SimpleTabProps> = ({ chunk, updateChunkField }) => {
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

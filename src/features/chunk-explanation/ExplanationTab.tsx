import ChunkExplanationTool from './ExplanationTool';
import { SimpleTabProps } from 'features/chunk-shared/types';


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

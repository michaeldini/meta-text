import React from 'react';
import ImageTool from '../../tools/image/ImageTool';
import type { Chunk } from '../../../../types/chunk';

interface AiImageTabProps {
    chunk: Chunk;
}

const AiImageTab: React.FC<AiImageTabProps> = ({ chunk }) => {
    return (
        <ImageTool
            chunkIdx={chunk.id}
            chunk={chunk}
        />
    );
};

export default AiImageTab;

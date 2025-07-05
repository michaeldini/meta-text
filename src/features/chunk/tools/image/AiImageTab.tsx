import React from 'react';
import type { ChunkType } from 'types';
import ImageTool from '../../tools/image/ImageTool';

interface AiImageTabProps {
    chunk: ChunkType;
}

const AiImageTab: React.FC<AiImageTabProps> = ({ chunk }) => {
    return (
        <ImageTool
            chunk={chunk}
        />
    );
};

export default AiImageTab;

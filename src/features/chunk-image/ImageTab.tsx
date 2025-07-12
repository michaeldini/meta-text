import React from 'react';
import ImageTool from './ImageTool';
import { BaseChunkProps } from 'features/chunk-shared/types';


const AiImageTab: React.FC<BaseChunkProps> = ({ chunk }) => {
    return (
        <ImageTool
            chunk={chunk}
        />
    );
};

export default AiImageTab;

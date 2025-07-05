import React from 'react';
import type { ChunkType } from 'types';
import ImageTool from '../../tools/image/ImageTool';
import { BaseTabProps } from '../types';


const AiImageTab: React.FC<BaseTabProps> = ({ chunk }) => {
    return (
        <ImageTool
            chunk={chunk}
        />
    );
};

export default AiImageTab;

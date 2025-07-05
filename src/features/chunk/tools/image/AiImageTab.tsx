import React from 'react';
import ImageTool from '../../tools/image/ImageTool';
import { BaseChunkProps } from '../types';


const AiImageTab: React.FC<BaseChunkProps> = ({ chunk }) => {
    return (
        <ImageTool
            chunk={chunk}
        />
    );
};

export default AiImageTab;

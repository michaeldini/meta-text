import React from 'react';
import CompressionDisplayTool from './CompressionDisplayTool';
import { BaseChunkProps } from '../types';

const CompressionTab: React.FC<BaseChunkProps> = ({ chunk }) => {
    return (
        <CompressionDisplayTool chunk={chunk} />
    );
};

export default CompressionTab;

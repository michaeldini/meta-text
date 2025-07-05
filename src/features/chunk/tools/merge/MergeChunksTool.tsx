import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { UndoArrowIcon } from 'icons';
import { useMergeChunks } from './useMergeChunks';

import { MergeChunksToolComponentProps } from '../types';
/**
 * Merge Chunks Tool Component
 * Allows merging two consecutive chunks
 */
const MergeChunksTool: React.FC<MergeChunksToolComponentProps> = ({
    chunkIndices,
    chunks,
    onComplete
}) => {
    const { mergeChunks } = useMergeChunks();

    const handleMerge = async (e: React.MouseEvent) => {
        e.stopPropagation();

        const result = await mergeChunks({
            chunkIndices,
            chunks
        });

        onComplete?.(result.success, result.data);
    };

    if (chunkIndices.length !== 2) {
        return null;
    }

    return (
        <Tooltip title="Undo split (merge with next chunk)">
            <IconButton
                size="small"
                onClick={handleMerge}
                aria-label="Undo split (merge with next chunk)"
            >
                <UndoArrowIcon />
            </IconButton>
        </Tooltip>
    );
};

export default MergeChunksTool;

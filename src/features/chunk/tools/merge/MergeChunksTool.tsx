// Merge Chunks Tool Component
// Provides functionality to merge two consecutive chunks into one  
// Strictly removes meta-data from the other chunk when merging.

import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { UndoArrowIcon } from 'icons';
import { useMergeChunks } from './useMergeChunks';

import { MergeChunksToolProps } from '../types';
/**
 * Merge Chunks Tool Component
 * Allows merging two consecutive chunks
 */
const MergeChunksTool: React.FC<MergeChunksToolProps> = ({
    chunkIndices,
    chunks,
    // onComplete
}) => {
    const { mergeChunks } = useMergeChunks();

    const handleMerge = async (e: React.MouseEvent) => {
        e.stopPropagation();

        const result = await mergeChunks({
            chunkIndices,
            chunks
        });

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

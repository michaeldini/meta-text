// Merge Chunks Tool Component
// Provides functionality to merge two consecutive chunks into one  
// Strictly removes meta-data from the other chunk when merging.

import React, { useState } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { HiArrowUturnLeft } from 'react-icons/hi2';
import { useMergeChunks } from './hooks/useMergeChunks';

import { MergeChunksToolProps } from 'features/chunk-shared/types';
/**
 * Merge Chunks Tool Component
 * Allows merging two consecutive chunks
 */

export function MergeChunksTool({ chunkIndices, onComplete }: MergeChunksToolProps) {
    const { mergeChunks } = useMergeChunks();
    const [isLoading, setIsLoading] = useState(false);

    const handleMerge = async (e: React.MouseEvent) => {
        e.stopPropagation();

        if (isLoading) return;

        setIsLoading(true);
        try {
            const result = await mergeChunks({
                chunkIndices
            });

            // Call completion callback if provided
            onComplete?.(result.success, result);
        } catch (error) {
            console.error('Failed to merge chunks:', error);
            onComplete?.(false, { error: error instanceof Error ? error.message : 'Failed to merge chunks' });
        } finally {
            setIsLoading(false);
        }
    };

    if (chunkIndices.length !== 2) {
        return null;
    }

    return (
        <Tooltip title="Undo split (merge with next chunk)">
            <IconButton
                size="small"
                onClick={handleMerge}
                disabled={isLoading}
                aria-label="Undo split (merge with next chunk)"
            >
                <HiArrowUturnLeft />
            </IconButton>
        </Tooltip>
    );
}

export default MergeChunksTool;
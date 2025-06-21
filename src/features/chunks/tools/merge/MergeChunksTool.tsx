import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { UndoArrowIcon } from '../../../../components/icons';
import { useMergeChunks } from './useMergeChunks';
import { MergeChunksToolProps } from '../types';

interface MergeChunksToolComponentProps extends MergeChunksToolProps {
    onComplete?: (success: boolean, result?: any) => void;
}

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
                <UndoArrowIcon style={{ width: 20, height: 20, color: 'currentColor' }} />
            </IconButton>
        </Tooltip>
    );
};

export default MergeChunksTool;

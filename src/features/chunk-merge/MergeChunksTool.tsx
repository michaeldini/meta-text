import { HiArrowUturnLeft } from 'react-icons/hi2';
// Merge Chunks Tool Component
// Provides functionality to merge two consecutive chunks into one  
// Strictly removes meta-data from the other chunk when merging.

// The tool is a an arrorw icon with a tooltip
import React, { useState } from 'react';
import { IconButton } from '@chakra-ui/react';
import { Tooltip } from '@components/ui/tooltip'

// import a hook to handle merging chunks
import { useMergeChunks } from './hooks/useMergeChunks';
import { ChunkType } from '@mtypes/documents';


export interface MergeChunksToolProps {
    chunk: ChunkType;
}
/**
 * Merge Chunks Tool Component
 * Allows merging two consecutive chunks
 */
// export function MergeChunksTool({ chunkIndices, onComplete }: MergeChunksToolProps) {
export function MergeChunksTool({ chunk }: MergeChunksToolProps) {

    // get function that will merge the chunks
    const { mutateAsync } = useMergeChunks();
    const metatextId = chunk.metatext_id; // Get from chunk instead of store

    // Local state to manage loading state
    const [isLoading, setIsLoading] = useState(false);

    // Handle merge action
    const handleMerge = async (e: React.MouseEvent) => {
        e.stopPropagation();

        if (isLoading) return;

        setIsLoading(true);
        try {
            if (!metatextId) {
                console.error('Metatext ID is not set, cannot merge chunks');
                return;
            }
            await mutateAsync({
                chunk,
                metatextId,
            });
        } catch (error) {
            console.error('Failed to merge chunks:', error);
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <Tooltip content="Undo split (merge with next chunk)">
            <IconButton
                variant="ghost"
                onClick={handleMerge}
                disabled={isLoading}
                aria-label="Undo split (merge with next chunk)"
                color="primary"
            >
                <HiArrowUturnLeft />
            </IconButton>
        </Tooltip>
    );
}

export default MergeChunksTool;
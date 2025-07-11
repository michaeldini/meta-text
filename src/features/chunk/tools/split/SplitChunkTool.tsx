import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { ContentCutIcon } from 'icons';
import { useSplitChunk } from './useSplitChunk';
import { log } from 'utils';
import { SplitChunkToolProps } from '../types';

/**
 * A tool component that provides functionality to split a text chunk at a specific word position.
 * 
 * This component renders an icon button with a scissors icon that, when clicked, will split
 * the current chunk into two separate chunks at the specified word position. The split operation
 * is performed asynchronously and the result is communicated back through the onComplete callback.
 * 
 * @component
 * @example
 * ```tsx
 * <SplitChunkTool
 *   chunkId="chunk_123"
 *   chunkIdx={0}
 *   wordIdx={15}
 *   word="example"
 *   chunk={chunkData}
 *   onComplete={(success, data) => {
 *     if (success) {
 *       console.log('Chunk split successfully:', data);
 *     }
 *   }}
 * />
 * ```
 */
const SplitChunkTool: React.FC<SplitChunkToolProps> = ({
    chunkId,
    chunkIdx,
    wordIdx,
    word,
    chunk,
    onComplete
}) => {
    const { splitChunk } = useSplitChunk();

    /**
     * Handles the chunk splitting operation when the button is clicked.
     * 
     * This function logs the split operation, calls the splitChunk hook with the
     * current component props, and then invokes the onComplete callback with the
     * operation result.
     * 
     * @async
     * @function handleSplit
     * @returns {Promise<void>} A promise that resolves when the split operation is complete
     */
    const handleSplit = async () => {
        log.info(`Splitting chunk ${chunkId} at word "${word}"`);
        const result = await splitChunk({
            chunkId,
            chunkIdx,
            wordIdx,
            word,
            chunk,
            onComplete
        });

        onComplete?.(result.success, result.data);
    };

    return (
        <Tooltip title={`Split chunk at "${word}"`}>
            <IconButton
                onClick={handleSplit}
                size="small"
                aria-label={`Split chunk at ${word}`}
            >
                <ContentCutIcon />
            </IconButton>
        </Tooltip>
    );
};

export default SplitChunkTool;

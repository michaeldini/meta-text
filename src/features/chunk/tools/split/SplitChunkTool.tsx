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
    onComplete // closes the popover after split
}) => {

    const { splitChunk } = useSplitChunk();

    const handleSplit = async () => {
        log.debug(`Splitting chunk ${chunkId} at word "${word}"`);
        const result = await splitChunk({
            chunkId,
            chunkIdx,
            wordIdx,
            word,
            chunk,
        });

        onComplete?.(result.success, result.data);
    };

    return (
        <Tooltip title={`Split chunk at "${word}"`}>
            <IconButton
                onClick={handleSplit}
                size="small"
                aria-label={`Split chunk at word "${word}"`}
            >
                <ContentCutIcon />
            </IconButton>
        </Tooltip>
    );
};

export default SplitChunkTool;

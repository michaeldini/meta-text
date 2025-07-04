import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { ContentCutIcon } from 'icons';
import { useSplitChunk } from './useSplitChunk';
import { log } from 'utils';
import { SplitChunkToolComponentProps } from '../types';

/**
 * Split Chunk Tool Component
 * Allows splitting a chunk at a specific word
 */
const SplitChunkTool: React.FC<SplitChunkToolComponentProps> = ({
    chunkIdx,
    wordIdx,
    word,
    // context,
    chunk,
    onComplete
}) => {
    const { splitChunk } = useSplitChunk();

    const handleSplit = async () => {
        log.info(`Splitting chunk ${chunkIdx} at word "${word}"`);
        const result = await splitChunk({
            chunkIdx,
            wordIdx,
            word,
            // context,
            chunk
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

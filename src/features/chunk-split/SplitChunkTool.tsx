import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { ContentCutIcon } from 'icons';
import { useSplitChunk } from './hooks/useSplitChunk';
import { log } from 'utils';
import { SplitChunkToolProps } from 'features/chunk-shared/types';

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

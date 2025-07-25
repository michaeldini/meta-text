import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { ContentCutIcon } from 'icons';
import { useSplitChunk } from './hooks/useSplitChunk';
import { log } from 'utils';
import { SplitChunkToolProps } from 'features/chunk-shared/types';

export function SplitChunkTool(props: SplitChunkToolProps) {
    const { chunkId, chunkIdx, wordIdx, word, chunk, onComplete } = props;

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

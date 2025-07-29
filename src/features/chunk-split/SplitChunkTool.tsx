import React from 'react';
import { TooltipButton } from 'components';
import { HiScissors } from 'react-icons/hi2';
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
        <TooltipButton
            label="Split"
            tooltip={`Split chunk at "${word}"`}
            icon={<HiScissors />}
            iconSize="2xl"
            onClick={handleSplit}
            aria-label={`Split chunk at word "${word}"`}
            size="2xl"
            color="primary"

        />
    );
}


export default SplitChunkTool;

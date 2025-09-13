import React from 'react';
import { HiScissors } from 'react-icons/hi2';
import { TooltipButton } from '@components/ui/TooltipButton';
import { useSplitChunk } from '@features/chunk/hooks/useSplitChunk';
import log from '@utils/logger';
// import { SplitChunkToolProps } from '@features/chunk-shared/types';
import { ChunkType } from '@mtypes/index';

export interface SplitChunkToolProps {
    chunk: ChunkType; // needed to get metatextId and chunkId
    word: string; // needed for the tooltip
    wordIdx?: number | null; // needed to split at this index. disable button if null
    onComplete: () => void;
}

export function SplitChunkTool(props: SplitChunkToolProps) {
    const { wordIdx, word, chunk, onComplete } = props;
    const metatextId = chunk.metatext_id;
    const { mutateAsync } = useSplitChunk();

    const handleSplit = async () => {
        if (!metatextId) {
            log.error('Metatext ID is not set, cannot split chunk');
            return;
        }
        log.debug(`Splitting chunk ${chunk.id} at word "${word}"`);
        try {
            if (wordIdx == null) {
                log.error('Word index is not set, cannot split chunk');
                return;
            }
            await mutateAsync({
                chunkId: chunk.id,
                wordIdx,
                metatextId,
            });
            onComplete();
        } catch (e) {
            log.error('Split chunk mutation failed', e);
        }
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
            disabled={!wordIdx}

        />
    );
}


export default SplitChunkTool;

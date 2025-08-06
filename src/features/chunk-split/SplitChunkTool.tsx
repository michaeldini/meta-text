import React from 'react';
import { TooltipButton } from '@components/TooltipButton';
import { HiScissors } from 'react-icons/hi2';
import { useSplitChunk } from '@features/chunk/hooks/useSplitChunk';
import log from '@utils/logger';
// import { SplitChunkToolProps } from '@features/chunk-shared/types';
import { useMetatextDetailStore } from '@store/metatextDetailStore';
import { ChunkType } from '@mtypes/index';

export interface SplitChunkToolProps {
    chunk: ChunkType;
    chunkId: number;
    word: string;
    wordIdx: number;
    onComplete: () => void;
}

export function SplitChunkTool(props: SplitChunkToolProps) {
    const { chunkId, wordIdx, word, chunk, onComplete } = props;
    const { metatextId } = useMetatextDetailStore((state) => state);
    const { mutateAsync } = useSplitChunk();

    const handleSplit = async () => {
        if (!metatextId) {
            log.error('Metatext ID is not set, cannot split chunk');
            return;
        }
        log.debug(`Splitting chunk ${chunkId} at word "${word}"`);
        try {
            const result = await mutateAsync({
                chunkId,
                wordIdx,
                metatextId,
            });
            // Optionally call onComplete if needed
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
            color="primary"

        />
    );
}


export default SplitChunkTool;

import React from 'react';
import { TooltipButton } from '@components/TooltipButton';
import { HiScissors } from 'react-icons/hi2';
// import { useSplitChunk } from './hooks/useSplitChunk';
import { useSplitChunk } from '@features/chunk/hooks/useSplitChunk';
import log from '@utils/logger';
import { SplitChunkToolProps } from '@features/chunk-shared/types';
import { useMetatextStore } from '@store/metatextStore';


export function SplitChunkTool(props: SplitChunkToolProps) {
    const { chunkId, wordIdx, word, chunk, onComplete } = props;
    const { metatextId } = useMetatextStore((state) => state);
    const { mutateAsync: splitChunk } = useSplitChunk();

    const handleSplit = async () => {
        if (!metatextId) {
            log.error('Metatext ID is not set, cannot split chunk');
            return;
        }
        log.debug(`Splitting chunk ${chunkId} at word "${word}"`);
        try {
            const result = await splitChunk({
                chunkId,
                wordIdx,
                metatextId,
            });
            // Optionally call onComplete if needed
            // onComplete?.(result.success, result.data);
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

// Renders interactive word spans with pointer/touch handlers and highlight styling
// Extracted from ChunkWords to keep parent lean and focused on data/state

import React, { memo } from 'react';
import { Box } from '@styles';
import { useSearchStore } from '@features/chunk-search/store/useSearchStore';

export interface InteractiveTextProps {
    words: string[];
    chunkIdx: number;
    selectedWordIndices: number[];
    textSizePx: number;
    lineHeight: number | string;
    fontFamily: string;
    paddingX: number;
    onWordDown: (wordIdx: number) => void;
    onWordEnter: (wordIdx: number) => void;
    onWordUp: () => void;
    onPointerMove?: React.PointerEventHandler<HTMLElement>;
}

const InteractiveText = memo(function InteractiveText({
    words,
    chunkIdx,
    selectedWordIndices,
    textSizePx,
    lineHeight,
    fontFamily,
    paddingX,
    onWordDown,
    onWordEnter,
    onWordUp,
    onPointerMove,
}: InteractiveTextProps) {
    // Memoize the set of selected word indices for efficient lookup
    const highlightedSet = React.useMemo(() => new Set(selectedWordIndices), [selectedWordIndices]);

    // Get current search query from store
    const { query } = useSearchStore();
    const lowerQuery = (query || '').toLowerCase();
    const showSearchHighlights = lowerQuery.length >= 2;

    return (
        <>
            {words.map((word, wordIdx) => {
                const isHighlighted = highlightedSet.has(wordIdx);
                const content = showSearchHighlights ? (() => {
                    const lowerWord = word.toLowerCase();
                    const idx = lowerWord.indexOf(lowerQuery);
                    if (idx === -1) return word;
                    const before = word.slice(0, idx);
                    const match = word.slice(idx, idx + lowerQuery.length);
                    const after = word.slice(idx + lowerQuery.length);
                    return (
                        <>
                            {before}
                            <Box as="span" css={{ background: 'gold', color: 'black', px: '2px', borderRadius: '4px' }}>{match}</Box>
                            {after}
                        </>
                    );
                })() : word;
                return (
                    <Box
                        as="span"
                        key={wordIdx}
                        css={{
                            fontSize: `${textSizePx}px`,
                            lineHeight,
                            fontFamily,
                            padding: 0,
                            paddingLeft: `${paddingX}em`,
                            paddingRight: `${paddingX}em`,
                            color: isHighlighted ? '$colors$buttonPrimaryBg' : undefined,
                            cursor: 'pointer',
                            userSelect: 'none',
                            touchAction: 'none',
                            display: 'inline-block',
                            // background: isHighlighted ? '$colors$gray400' : undefined,
                            borderRadius: isHighlighted ? '4px' : undefined,
                            transition: 'color 0.15s',
                            '&:hover': !isHighlighted ? { color: '$colors$buttonPrimaryBg', } : undefined,
                        }}
                        onPointerDown={() => onWordDown(wordIdx)}
                        onPointerEnter={() => onWordEnter(wordIdx)}
                        onPointerUp={onWordUp}
                        onPointerMove={onPointerMove}
                        data-word-idx={`${chunkIdx}-${wordIdx}`}
                    >
                        {content}
                    </Box>
                );
            })}
        </>
    );
});

export default InteractiveText;

// Purpose: Render text as selectable tokens enabling click-and-drag multi-word selection.
// Emits the selected phrase with the full text and selection char range via onSelection callback.
// Also supports rendering incoming highlight ranges with custom background colors.

import React, { useState } from 'react';
import { Box, Text } from '@chakra-ui/react';
import { Highlight } from '../../../types/experiments';

export type WordSelectorProps = {
    text: string;
    onSelection?: (selection: string, contextText: string, range: { start: number; end: number }) => void;
    highlights?: Highlight[]; // optional colored highlights to render
};

type Token = { value: string; isWord: boolean; start: number; end: number };

export const WordSelector: React.FC<WordSelectorProps> = ({ text, onSelection, highlights }) => {
    // Tokenize into words, whitespace, and punctuation; also track char offsets
    const regex = /(\w+|\s+|[^\s\w]+)/g;
    const tokens: Token[] = [];
    let cursor = 0;
    for (const m of text.matchAll(regex)) {
        const value = m[0];
        const start = cursor;
        const end = start + value.length;
        tokens.push({ value, isWord: /^\w+$/.test(value), start, end });
        cursor = end;
    }

    const [isSelecting, setIsSelecting] = useState(false);
    const [anchorIdx, setAnchorIdx] = useState<number | null>(null); // index in tokens for a word token
    const [hoverIdx, setHoverIdx] = useState<number | null>(null);

    const resetSelection = () => {
        setIsSelecting(false);
        setAnchorIdx(null);
        setHoverIdx(null);
    };

    const handleMouseDown = (idx: number) => {
        setIsSelecting(true);
        setAnchorIdx(idx);
        setHoverIdx(idx);
    };

    const handleMouseEnter = (idx: number) => {
        if (isSelecting) setHoverIdx(idx);
    };

    const handleMouseUp = () => {
        if (!isSelecting || anchorIdx === null || hoverIdx === null) {
            resetSelection();
            return;
        }

        // Determine selection bounds across word tokens
        const startIdx = Math.min(anchorIdx, hoverIdx);
        const endIdx = Math.max(anchorIdx, hoverIdx);

        const wordTokenIndices = tokens
            .map((t, i) => ({ t, i }))
            .filter(({ t }) => t.isWord)
            .map(({ i }) => i);

        // If indices are not valid (shouldn't happen), bail
        if (!wordTokenIndices.includes(startIdx) || !wordTokenIndices.includes(endIdx)) {
            resetSelection();
            return;
        }

        // Compute character range from first->last selected word token
        const charStart = tokens[startIdx].start;
        const charEnd = tokens[endIdx].end;
        let selection = text.slice(charStart, charEnd);
        selection = selection.trim();

        if (selection.length > 0) {
            onSelection?.(selection, text, { start: charStart, end: charEnd });
        }

        resetSelection();
    };

    // Calculate whether a token should be visually highlighted
    const isTokenSelected = (i: number) => {
        if (!isSelecting || anchorIdx === null || hoverIdx === null) return false;
        const [lo, hi] = [Math.min(anchorIdx, hoverIdx), Math.max(anchorIdx, hoverIdx)];
        return i >= lo && i <= hi;
    };

    // helper: find highlight color for a token char range, if any
    const getTokenHighlightColor = (start: number, end: number): string | undefined => {
        if (!highlights || highlights.length === 0) return undefined;
        // find the first highlight that overlaps the token range
        const h = highlights.find(h => !(end <= h.start || start >= h.end));
        return h?.color;
    };

    return (
        <Text as="span" userSelect={isSelecting ? 'none' : 'text'} onMouseUp={handleMouseUp}>
            {tokens.map((tok, i) => {
                if (tok.isWord) {
                    const color = getTokenHighlightColor(tok.start, tok.end);
                    return (
                        <Box
                            key={i}
                            as="span"
                            px={0}
                            mx={0}
                            cursor="pointer"
                            onMouseDown={(e) => { e.preventDefault(); handleMouseDown(i); }}
                            onMouseEnter={() => handleMouseEnter(i)}
                            _hover={{ background: color ?? 'gray.700' }}
                            background={isTokenSelected(i) ? (color ?? 'gray.700') : (color ?? 'transparent')}
                            display="inline-block"
                        >
                            {tok.value}
                        </Box>
                    );
                }
                // punctuation/whitespace
                return (
                    <Box key={i} as="span" display="inline">{tok.value}</Box>
                );
            })}
        </Text>
    );
};

export default WordSelector;

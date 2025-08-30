/** DEPRECATED- UNUSED
 * For ChunkWords.tsx, you can:

Render <SelectableText /> in place of the per-word map.
Wire onSelection to open your BaseDrawer and feed WordsToolbar (single-word or multi-word).
Keep <MergeChunksTool /> as-is after <SelectableText />.
For WordSelector.tsx, you can:

Replace its internal tokenization and selection with <SelectableText />.
Pass the same onSelection and highlights it already supports.
Notes
The tokenizer uses the same regex style as WordSelector (\w+|\s+|[^\s\w]+), preserving behavior.
Pointer Events unify mouse/touch/stylus. If you need legacy touch/mouse fallbacks, we can add them behind a prop.
No existing files were modified; adoption can be done incrementally.
 */

// Purpose: Unified selectable text component for click-and-drag word selection with optional highlights.
// - Accepts raw text and renders tokens (words, whitespace, punctuation)
// - Supports mouse/touch/stylus via Pointer Events for selecting continuous word ranges
// - Emits selection text, character range, and word indices via onSelection
// - Renders incoming highlight ranges (e.g., annotations) with customizable colors
// - Keeps UI concerns (e.g., drawers, toolbars) outside this component

import React from 'react';
import { Box, Text } from '@chakra-ui/react';

export type SelectableHighlight = {
    start: number; // inclusive character offset in `text`
    end: number;   // exclusive character offset in `text`
    color?: string; // background color for the highlight
};

export type SelectionResult = {
    // The selected substring (trimmed of leading/trailing whitespace)
    selection: string;
    // The full context text the selection came from
    contextText: string;
    // Character range in the original text (non-trimmed range from first->last selected token)
    range: { start: number; end: number };
    // Word ordinal indices (0-based) within the text for start/end of the selection
    wordRange: { startWordIdx: number; endWordIdx: number };
};

export type SelectableTextProps = {
    text: string;
    highlights?: SelectableHighlight[];
    onSelection?: (result: SelectionResult) => void;
    onWordClick?: (word: string, wordIdx: number, charRange: { start: number; end: number }) => void;
    // Visuals
    selectedBg?: string; // background while actively selecting
    hoverBg?: string;    // background on hover
    color?: string;
    fontSizePx?: number;
    lineHeight?: number;
    fontFamily?: string;
    wordPaddingX?: number; // horizontal padding applied to word tokens
    // data/testing hooks
    "data-testid"?: string;
};

// Internal token model
type Token = { value: string; isWord: boolean; start: number; end: number };

// Tokenize into words, whitespace, punctuation; track char offsets.
function tokenize(text: string): Token[] {
    const regex = /(\w+|\s+|[^\s\w]+)/g; // keep words, spaces, punctuation separate
    const tokens: Token[] = [];
    let cursor = 0;
    for (const m of text.matchAll(regex)) {
        const value = m[0];
        const start = cursor;
        const end = start + value.length;
        tokens.push({ value, isWord: /^\w+$/.test(value), start, end });
        cursor = end;
    }
    // Handle empty or no matches case
    if (tokens.length === 0 && text.length > 0) {
        tokens.push({ value: text, isWord: /^\w+$/.test(text), start: 0, end: text.length });
    }
    return tokens;
}

// Map token index to its 0-based word ordinal, or -1 for non-word tokens.
function buildWordOrdinalMap(tokens: Token[]): { tokenToWord: number[]; wordTokenIndices: number[] } {
    const tokenToWord: number[] = Array(tokens.length).fill(-1);
    const wordTokenIndices: number[] = [];
    let w = 0;
    tokens.forEach((t, i) => {
        if (t.isWord) {
            tokenToWord[i] = w;
            wordTokenIndices.push(i);
            w += 1;
        }
    });
    return { tokenToWord, wordTokenIndices };
}

export function SelectableText({
    text,
    highlights,
    onSelection,
    onWordClick,
    selectedBg = 'gray.700',
    hoverBg = 'gray.700',
    color = 'gray.400',
    fontSizePx = 28,
    lineHeight = 1.5,
    fontFamily = 'Inter, sans-serif',
    wordPaddingX = 0.3,
    ...rest
}: SelectableTextProps) {
    const tokens = React.useMemo(() => tokenize(text), [text]);
    const { tokenToWord, wordTokenIndices } = React.useMemo(() => buildWordOrdinalMap(tokens), [tokens]);

    const [isSelecting, setIsSelecting] = React.useState(false);
    const [anchorIdx, setAnchorIdx] = React.useState<number | null>(null); // token index for a word token
    const [hoverIdx, setHoverIdx] = React.useState<number | null>(null);   // token index for a word token

    // Container ref not currently needed; add when external focus/scroll is required

    const resetSelection = React.useCallback(() => {
        setIsSelecting(false);
        setAnchorIdx(null);
        setHoverIdx(null);
    }, []);

    // Handle global pointer up/cancel to finish selection even when pointer leaves container
    React.useEffect(() => {
        const onUp = () => {
            if (!isSelecting) return;
            finalizeSelection();
        };
        const onCancel = () => resetSelection();
        window.addEventListener('pointerup', onUp);
        window.addEventListener('pointercancel', onCancel);
        return () => {
            window.removeEventListener('pointerup', onUp);
            window.removeEventListener('pointercancel', onCancel);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSelecting, anchorIdx, hoverIdx, tokens, tokenToWord, wordTokenIndices]);

    const startSelecting = (idx: number, e: React.PointerEvent) => {
        // Only start selection on primary button / touch / pen
        if (e.button !== undefined && e.button !== 0) return;
        (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
        setIsSelecting(true);
        setAnchorIdx(idx);
        setHoverIdx(idx);
    };

    const updateHover = (idx: number) => {
        if (isSelecting) setHoverIdx(idx);
    };

    const finalizeSelection = () => {
        if (!isSelecting || anchorIdx === null || hoverIdx === null) {
            resetSelection();
            return;
        }
        const startTokenIdx = Math.min(anchorIdx, hoverIdx);
        const endTokenIdx = Math.max(anchorIdx, hoverIdx);

        const startWordIdx = tokenToWord[startTokenIdx];
        const endWordIdx = tokenToWord[endTokenIdx];

        // Validate word indices
        if (startWordIdx < 0 || endWordIdx < 0) {
            resetSelection();
            return;
        }

        const charStart = tokens[startTokenIdx].start;
        const charEnd = tokens[endTokenIdx].end;
        const rawSelection = text.slice(charStart, charEnd);
        const selection = rawSelection.trim();

        if (selection.length > 0) {
            onSelection?.({
                selection,
                contextText: text,
                range: { start: charStart, end: charEnd },
                wordRange: { startWordIdx, endWordIdx },
            });

            // Single-word click convenience handler
            if (onWordClick && startWordIdx === endWordIdx) {
                const wordTokIdx = wordTokenIndices[startWordIdx];
                const t = tokens[wordTokIdx];
                onWordClick(t.value, startWordIdx, { start: t.start, end: t.end });
            }
        }

        resetSelection();
    };

    // Selection styling predicate for tokens
    const isTokenSelected = (i: number) => {
        if (!isSelecting || anchorIdx === null || hoverIdx === null) return false;
        const [lo, hi] = [Math.min(anchorIdx, hoverIdx), Math.max(anchorIdx, hoverIdx)];
        return i >= lo && i <= hi;
    };

    const getTokenHighlightColor = (start: number, end: number): string | undefined => {
        if (!highlights || highlights.length === 0) return undefined;
        // Return the first highlight that overlaps the token range
        const h = highlights.find(h => !(end <= h.start || start >= h.end));
        return h?.color;
    };

    return (
        <Text
            as="span"
            userSelect={isSelecting ? 'none' : 'text'}
            onPointerUp={finalizeSelection}
            color={color}
            {...rest}
        >
            {tokens.map((tok, i) => {
                if (tok.isWord) {
                    const color = getTokenHighlightColor(tok.start, tok.end);
                    const background = isTokenSelected(i) ? (color ?? selectedBg) : (color ?? 'transparent');
                    return (
                        <Box

                            key={i}
                            as="span"
                            px={wordPaddingX}
                            mx={0}
                            fontSize={`${fontSizePx}px`}
                            lineHeight={lineHeight}
                            fontFamily={fontFamily}
                            cursor="pointer"
                            onPointerDown={(e) => { e.preventDefault(); startSelecting(i, e); }}
                            onPointerEnter={() => updateHover(i)}
                            _hover={{ background: color ?? hoverBg }}
                            background={background}
                            display="inline-block"
                            data-token-index={i}
                            data-word-idx={tokenToWord[i]}
                        >
                            {tok.value}
                        </Box>
                    );
                }
                // punctuation/whitespace
                return (
                    <Box key={i} as="span" display="inline" fontSize={`${fontSizePx}px`} lineHeight={lineHeight} fontFamily={fontFamily}>
                        {tok.value}
                    </Box>
                );
            })}
        </Text>
    );
}

export default SelectableText;

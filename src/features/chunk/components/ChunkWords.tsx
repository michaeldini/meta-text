// Contains the words for a chunk, allowing for word selection and actions
// Each word in the chunk can be selected, and actions can be performed on the selected words
// At the end of the chunk, there is a button to merge the current chunk with the next one

import React, { memo, useRef, useState } from 'react';
import { Drawer } from '@chakra-ui/react';
import { MergeChunksTool } from 'features/chunk-merge';
import WordsToolbar from './WordsToolbar';
import { useUserConfig } from 'services/userConfigService';
import { useWordSelection } from '../hooks/useWordSelection';
import type { ChunkType } from 'types';
export interface ChunkWordsProps {
    chunk: ChunkType;
    chunkIdx: number;
}

const ChunkWords = memo(function ChunkWords({
    chunk,
    chunkIdx
}: ChunkWordsProps) {
    const words = chunk.text ? chunk.text.split(/\s+/) : [];
    const containerRef = useRef<HTMLDivElement>(null);
    const { data: userConfig } = useUserConfig();
    const uiPrefs = userConfig?.uiPreferences || {};
    const textSizePx = uiPrefs.textSizePx ?? 28;
    const fontFamily = uiPrefs.fontFamily ?? 'Inter, sans-serif';
    const lineHeight = uiPrefs.lineHeight ?? 1.5;
    const paddingX = uiPrefs.paddingX ?? 0.3;



    // Word selection logic
    const {
        selectedWordIdx,
        highlightedIndices,
        handleWordDown,
        handleWordEnter,
        handleWordUp,
        handleToolbarClose,
        handleTouchMove,
    } = useWordSelection(chunkIdx);

    // Drawer state
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [drawerSelection, setDrawerSelection] = useState<{ word: string; wordIdx: number }[] | null>(null);

    // Only open drawer on mouseup/touchend (selection finalized)
    const selectionFinalizedRef = useRef(false);
    React.useEffect(() => {
        if (selectionFinalizedRef.current && highlightedIndices.length > 0) {
            setDrawerSelection(highlightedIndices.map(i => ({ word: words[i], wordIdx: i })));
            setDrawerOpen(true);
            selectionFinalizedRef.current = false;
        }
    }, [highlightedIndices, words]);

    // Patch handleWordUp to set selectionFinalizedRef
    const handleWordUpPatched = () => {
        selectionFinalizedRef.current = true;
        handleWordUp();
    };

    // Close drawer and clear selection
    const closeDrawer = () => {
        setDrawerOpen(false);
        setDrawerSelection(null);
        handleToolbarClose();
    };

    // Render words, highlight selected
    const wordsElements = words.map((word, wordIdx) => {
        const isHighlighted = highlightedIndices.includes(wordIdx);
        return (
            <span
                key={wordIdx}
                style={{
                    paddingRight: `${paddingX}rem`,
                    fontSize: `${textSizePx}px`,
                    lineHeight: lineHeight,
                    fontFamily: fontFamily,
                    background: isHighlighted ? '#3182ce' : 'transparent',
                    color: isHighlighted ? 'white' : 'inherit',
                    borderRadius: isHighlighted ? '4px' : undefined,
                    cursor: 'pointer',
                    userSelect: 'none',
                    transition: 'background 0.1s',
                    display: 'inline-block',
                }}
                onMouseDown={e => handleWordDown(wordIdx, e)}
                onMouseEnter={e => handleWordEnter(wordIdx, e)}
                onMouseUp={handleWordUpPatched}
                onTouchStart={e => handleWordDown(wordIdx, e)}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleWordUpPatched}
                data-word-idx={`${chunkIdx}-${wordIdx}`}
                onMouseOver={e => { e.currentTarget.style.background = '#3182ce'; e.currentTarget.style.color = 'white'; }}
                onMouseOut={e => { if (!isHighlighted) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'inherit'; } }}
            >
                {word}
            </span>
        );
    });

    return (
        <div ref={containerRef} style={{ width: '100%' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 0 }}>
                {wordsElements}
                <span style={{ display: 'inline-block' }}>
                    <MergeChunksTool chunkIndices={[chunkIdx, chunkIdx + 1]} />
                </span>
            </div>

            <Drawer.Root open={drawerOpen} onOpenChange={e => { if (!e.open) closeDrawer(); }} placement="bottom" size="md">
                <Drawer.Backdrop />
                <Drawer.Positioner>
                    <Drawer.Content style={{ minHeight: '220px', marginBottom: '64px' }}>
                        <Drawer.Header>
                            <Drawer.Title>Word Tools</Drawer.Title>
                        </Drawer.Header>
                        <Drawer.Body style={{ paddingBottom: 48 }}>
                            {drawerSelection && drawerSelection.length > 0 && (
                                <WordsToolbar
                                    onClose={closeDrawer}
                                    word={drawerSelection.length > 1 ? drawerSelection.map(w => w.word).join(' ') : drawerSelection[0].word}
                                    wordIdx={drawerSelection[0].wordIdx}
                                    chunkIdx={chunkIdx}
                                    chunk={chunk}
                                />
                            )}
                        </Drawer.Body>
                    </Drawer.Content>
                </Drawer.Positioner>
            </Drawer.Root>
        </div>
    );
});

export default ChunkWords;

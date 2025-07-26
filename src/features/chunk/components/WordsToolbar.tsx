// Toolbar for word-level tools in a chunk
// This component provides a popover with tools for splitting and defining words in a chunk

import React, { memo } from 'react';
import { Popover, Box } from '@chakra-ui/react';
import { SplitChunkTool } from 'features/chunk-split';
import { WordsExplanationTool } from 'features/chunk-explanation';
import { getChunkComponentsStyles } from '../Chunk.styles';

export interface WordsToolbarProps {
    anchorEl: HTMLElement | null;
    onClose: () => void;
    word: string;
    wordIdx: number;
    chunkIdx: number;
    chunk: any;
}

/**
 * WordsToolbar - Layout component that presents word-level tools
 * This is a layout component that uses the split and define tools
 */

export function WordsToolbar({ anchorEl, onClose, word, wordIdx, chunkIdx, chunk }: WordsToolbarProps) {
    // Chakra UI v3 Popover refactor
    const [open, setOpen] = React.useState(Boolean(anchorEl));

    React.useEffect(() => {
        setOpen(Boolean(anchorEl));
    }, [anchorEl]);

    const handleToolComplete = (success: boolean, result?: any) => {
        setOpen(false);
        onClose();
    };

    return (
        <Popover.Root open={open} onOpenChange={e => { setOpen(e.open); if (!e.open) onClose(); }}>
            <Popover.Positioner>
                <Popover.Content>
                    <Popover.Arrow />
                    <Popover.Body>
                        <Box>
                            <SplitChunkTool
                                chunkId={chunk.id}
                                chunkIdx={chunkIdx}
                                wordIdx={wordIdx}
                                word={word}
                                chunk={chunk}
                                onComplete={handleToolComplete}
                            />
                            <WordsExplanationTool
                                word={word}
                                chunk={chunk}
                                onComplete={handleToolComplete}
                            />
                        </Box>
                    </Popover.Body>
                </Popover.Content>
            </Popover.Positioner>
        </Popover.Root>
    );
}

export default memo(WordsToolbar);
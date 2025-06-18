import React, { memo, useRef, useEffect } from 'react';
import { Box, Paper } from '@mui/material';
import ChunkWords from './words/ChunkWords';
import ChunkToolsDisplay from './tools/ChunkToolsDisplay';

import SummaryNotesComponent from '../chunks/tools/SummaryNotesComponent';
import { useDebouncedField } from '../../hooks/useDebouncedField';
import { chunkMainBox, chunkTextBox } from './styles/Chunks.styles';
import { useChunkStore } from '../../store/chunkStore';
import ChunkComparisonPanel from '../chunks/comparison/ChunkComparisonPanel';
import ChunkImagePanel from '../chunks/image/ChunkImagePanel';
import { useImageGeneration } from '../../hooks/useImageGeneration';

export interface ChunkProps {
    chunk: any;
    chunkIdx: number;
    handleWordClick: (chunkIdx: number, wordIdx: number) => void;
    handleRemoveChunk: (chunkIdx: number) => void;
    handleChunkFieldChange: (chunkIdx: number, field: string, value: any) => void;
}

const Chunk = memo(function Chunk({
    chunk,
    chunkIdx,
    handleWordClick,
    handleRemoveChunk,
    handleChunkFieldChange
}: ChunkProps) {
    const words = chunk.content ? chunk.content.split(/\s+/) : [];
    const { activeChunkId, setActiveChunk, activeTabs } = useChunkStore();
    const isActive = activeChunkId === chunk.id;
    const chunkRef = useRef<HTMLDivElement>(null);
    // Debounced fields for summary/notes
    const [summary, setSummary] = useDebouncedField(
        chunk.summary || '',
        (val: string) => handleChunkFieldChange(chunkIdx, 'summary', val),
        800
    );
    const [notes, setNotes] = useDebouncedField(
        chunk.notes || '',
        (val: string) => handleChunkFieldChange(chunkIdx, 'notes', val),
        800
    );
    // Image state for ChunkImagePanel
    const { state: imageState, setState: setImageState, getImgSrc, openDialog } = useImageGeneration(chunk);
    const setLightboxOpen = (open: boolean) => setImageState(s => ({ ...s, lightboxOpen: open }));
    const setImageLoaded = (loaded: boolean) => setImageState(s => ({ ...s, loaded }));

    useEffect(() => {
        if (isActive && chunkRef.current) {
            const navbarHeight = 64; // Adjust if your AppBar is a different height
            const rect = chunkRef.current.getBoundingClientRect();
        }
    }, [isActive]);

    return (
        <Paper ref={chunkRef} elevation={isActive ? 6 : 3} sx={{ ...chunkMainBox, border: isActive ? '2px solid #1976d2' : '1px solid #ccc', cursor: 'pointer' }} onClick={() => setActiveChunk(chunk.id)}>
            <ChunkWords
                words={words}
                chunkIdx={chunkIdx}
                handleWordClick={handleWordClick}
                handleRemoveChunk={handleRemoveChunk}
                chunk={chunk}
            />
            <Box>
                {activeTabs.includes('notes-summary') &&
                    <SummaryNotesComponent
                        summary={summary}
                        notes={notes}
                        setSummary={setSummary}
                        setNotes={setNotes}
                        onSummaryBlur={() => handleChunkFieldChange(chunkIdx, 'summary', summary)}
                        onNotesBlur={() => handleChunkFieldChange(chunkIdx, 'notes', notes)}
                    />
                }
                {activeTabs.includes('comparison') &&
                    <ChunkComparisonPanel
                        chunkId={chunk.id}
                        comparisonText={chunk.comparison}
                        onComparisonUpdate={text => handleChunkFieldChange(chunkIdx, 'comparison', text)}
                    />
                }
                {activeTabs.includes('ai-image') &&
                    <ChunkImagePanel
                        imageState={imageState}
                        openDialog={openDialog}
                        getImgSrc={getImgSrc}
                        setImageLoaded={setImageLoaded}
                        setLightboxOpen={setLightboxOpen}
                        imgPrompt={imageState.prompt}
                        createdAt={chunk.ai_image && chunk.ai_image.created_at}
                    />
                }
            </Box>
        </Paper >
    );
});

export default Chunk;

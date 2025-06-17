import React, { memo, useRef, useEffect } from 'react';
import { Box, Paper } from '@mui/material';
import ChunkWords from './words/ChunkWords';
import ChunkTools from './tools/ChunkTools';
import SummaryNotesComponent from '../chunks/tools/SummaryNotesComponent';
import { useDebouncedField } from '../../hooks/useDebouncedField';
import { chunkMainBox, chunkTextBox } from './styles/Chunks.styles';
import { useChunkStore } from '../../store/chunkStore';

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

    useEffect(() => {
        if (isActive && chunkRef.current) {
            const navbarHeight = 64; // Adjust if your AppBar is a different height
            const rect = chunkRef.current.getBoundingClientRect();
            const scrollTop = window.pageYOffset + rect.top - navbarHeight - 32; // 32px extra padding
            window.scrollTo({ top: scrollTop, behavior: 'smooth' });
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
                <Box sx={{ mt: 2, p: 2, borderRadius: 1 }}>
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
                    {activeTabs.includes('notes-summary') && <span>Notes/Summary tab is active (from navbar)</span>}
                    {activeTabs.includes('comparison') && <span>Comparison tab is active (from navbar)</span>}
                    {activeTabs.includes('ai-image') && <span>AI Image tab is active (from navbar)</span>}
                    {/* {activeTabs.length === 0 && <span>No tool selected</span>} */}
                </Box>
            </Box>
        </Paper>
    );
});

export default Chunk;

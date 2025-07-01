import React, { useCallback } from 'react';
import NotesTool from '../../tools/notes/NotesTool';
import type { ChunkType, ChunkFieldValue } from 'types';

interface NotesSummaryTabProps {
    chunk: ChunkType;
    updateChunkField: (chunkId: number, field: keyof ChunkType, value: ChunkFieldValue) => void;
}

const NotesSummaryTab: React.FC<NotesSummaryTabProps> = ({ chunk, updateChunkField }) => {
    const setSummary = useCallback((val: string) => updateChunkField(chunk.id, 'summary', val), [chunk.id, updateChunkField]);
    const setNotes = useCallback((val: string) => updateChunkField(chunk.id, 'notes', val), [chunk.id, updateChunkField]);

    return (
        <NotesTool
            chunkIdx={chunk.id}
            chunk={chunk}
            summary={chunk.summary}
            notes={chunk.notes}
            onSummaryUpdate={setSummary}
            onNotesUpdate={setNotes}
            onSummaryBlur={() => { }}
            onNotesBlur={() => { }}
        />
    );
};

export default NotesSummaryTab;

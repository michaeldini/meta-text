import React, { useCallback } from 'react';
import NotesTool from './NotesTool';
import type { ChunkType, UpdateChunkFieldFn } from 'types';

interface NotesSummaryTabProps {
    chunk: ChunkType;
    updateChunkField: UpdateChunkFieldFn
}

const NotesTab: React.FC<NotesSummaryTabProps> = ({ chunk, updateChunkField }) => {
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

export default NotesTab;

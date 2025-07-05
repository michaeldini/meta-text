import React, { useCallback } from 'react';
import NotesTool from './NotesTool';
import type { ChunkType, UpdateChunkFieldFn } from 'types';

interface NotesSummaryTabProps {
    chunk: ChunkType;
    updateChunkField: UpdateChunkFieldFn
}

const NotesTab: React.FC<NotesSummaryTabProps> = ({ chunk, updateChunkField }) => {
    // Save summary/notes only on blur
    const handleSummaryBlur = useCallback(
        (val: string) => updateChunkField(chunk.id, 'summary', val),
        [chunk.id, updateChunkField]
    );
    const handleNotesBlur = useCallback(
        (val: string) => updateChunkField(chunk.id, 'notes', val),
        [chunk.id, updateChunkField]
    );

    return (
        <NotesTool
            summary={chunk.summary}
            notes={chunk.notes}
            onSummaryBlur={handleSummaryBlur as (val: string) => void}
            onNotesBlur={handleNotesBlur as (val: string) => void}
        />
    );
};

export default NotesTab;

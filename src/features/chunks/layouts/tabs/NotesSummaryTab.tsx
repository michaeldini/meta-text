import React, { useCallback } from 'react';
import NotesTool from '../../tools/notes/NotesTool';
import type { Chunk } from '../../../../types/chunk';
import type { ChunkFieldValue } from '../../../../store/chunkStore';

interface NotesSummaryTabProps {
    chunk: Chunk;
    updateChunkField: (chunkId: number, field: keyof Chunk, value: ChunkFieldValue) => void;
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

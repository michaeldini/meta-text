/**
 * NotesTab component wrapper for the NotesTool
 * Handles chunk updates and provides the interface between tab system and notes tool
 */
import React, { useCallback } from 'react';
import NotesTool from './NotesTool';
import { SimpleTabProps } from '../types';

const NotesTab: React.FC<SimpleTabProps> = ({ chunk, updateChunkField }) => {
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
            onSummaryBlur={handleSummaryBlur}
            onNotesBlur={handleNotesBlur}
        />
    );
};

export default NotesTab;

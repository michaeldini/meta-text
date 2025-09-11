/**
 * NotesTool component for managing summary and note fields
 * Provides input fields for chunk summary and note with local state management
 * and blur-based persistence
 */
import React, { useState, useEffect, useCallback } from 'react';
import { Box } from '@styles';

import { ChunkTextField } from '@features/chunk/components/ChunkTextField';
import type { ChunkType, UpdateChunkFieldMutationFn } from '@mtypes/documents';

interface NotesToolProps {
    chunk: ChunkType;
    mutateChunkField: UpdateChunkFieldMutationFn;
    isVisible: boolean;
}

export const NotesTool = React.memo((props: NotesToolProps) => {
    const { chunk, mutateChunkField, isVisible } = props;


    // Handle null/undefined values by converting to empty string
    const sanitizedSummary = chunk.summary ?? '';
    const sanitizedNote = chunk.note ?? '';

    const [localSummary, setLocalSummary] = useState(sanitizedSummary);
    const [localNote, setLocalNote] = useState(sanitizedNote);

    // Update local state when props change
    useEffect(() => {
        setLocalSummary(sanitizedSummary);

    }, [sanitizedSummary]);

    useEffect(() => {
        setLocalNote(sanitizedNote);
    }, [sanitizedNote]);

    // Memoized handlers to prevent unnecessary re-renders
    const handleSummaryChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setLocalSummary(e.target.value);
    }, []);

    const handleNotesChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setLocalNote(e.target.value);
    }, []);

    const handleSummaryBlur = useCallback(() => {
        console.log('NotesTool chunk.id:', chunk.id);
        mutateChunkField({ chunkId: chunk.id, field: 'summary', value: localSummary });

    }, [chunk.id, mutateChunkField, localSummary]);

    const handleNotesBlur = useCallback(() => {
        mutateChunkField({ chunkId: chunk.id, field: 'note', value: localNote });
    }, [chunk.id, mutateChunkField, localNote]);


    if (!isVisible) return null;
    return (
        <Box>
            <ChunkTextField
                label="Summary"
                value={localSummary}
                onChange={handleSummaryChange}
                onBlur={handleSummaryBlur}
                placeholder="Enter a brief summary of this chunk..."
                aria-label="Summary input field"
            />
            <ChunkTextField
                label="Notes"
                value={localNote}
                onChange={handleNotesChange}
                onBlur={handleNotesBlur}
                placeholder="Add your note and observations..."
                aria-label="Notes input field"
            />
        </Box>
    );
});

NotesTool.displayName = 'NotesTool';

export default NotesTool;

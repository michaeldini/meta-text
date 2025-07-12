/**
 * NotesTool component for managing summary and notes fields
 * Provides input fields for chunk summary and notes with local state management
 * and blur-based persistence
 */
import React, { useState, useEffect, useCallback } from 'react';
import { Box, useTheme } from '@mui/material';

import { ChunkTextField } from 'features/chunk/components';
import { getSharedToolStyles } from 'features/chunk-shared/styles';
import { NotesToolProps } from 'features/chunk-shared/types';

const NotesTool: React.FC<NotesToolProps> = React.memo(({
    summary = '',
    notes = '',
    onSummaryBlur = () => { },
    onNotesBlur = () => { },
    summaryFieldSx,
    notesFieldSx
}) => {
    const theme = useTheme();
    const styles = getSharedToolStyles(theme);

    // Handle null/undefined values by converting to empty string
    const sanitizedSummary = summary ?? '';
    const sanitizedNotes = notes ?? '';

    const [localSummary, setLocalSummary] = useState(sanitizedSummary);
    const [localNotes, setLocalNotes] = useState(sanitizedNotes);

    // Update local state when props change
    useEffect(() => {
        setLocalSummary(sanitizedSummary);
    }, [sanitizedSummary]);

    useEffect(() => {
        setLocalNotes(sanitizedNotes);
    }, [sanitizedNotes]);

    // Memoized handlers to prevent unnecessary re-renders
    const handleSummaryChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalSummary(e.target.value);
    }, []);

    const handleNotesChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalNotes(e.target.value);
    }, []);

    const handleSummaryBlur = useCallback(() => {
        onSummaryBlur(localSummary);
    }, [localSummary, onSummaryBlur]);

    const handleNotesBlur = useCallback(() => {
        onNotesBlur(localNotes);
    }, [localNotes, onNotesBlur]);

    // Handle keyboard shortcuts for better UX
    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        // Ctrl/Cmd + S to save (trigger blur)
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            if (e.currentTarget.getAttribute('aria-label')?.includes('Summary')) {
                handleSummaryBlur();
            } else {
                handleNotesBlur();
            }
        }
    }, [handleSummaryBlur, handleNotesBlur]);

    return (
        <Box sx={styles.toolTabContainer}>
            <ChunkTextField
                label="Summary"
                value={localSummary}
                onChange={handleSummaryChange}
                onBlur={handleSummaryBlur}
                onKeyDown={handleKeyDown}
                sx={summaryFieldSx}
                placeholder="Enter a brief summary of this chunk..."
                aria-label="Summary input field"
            />
            <ChunkTextField
                label="Notes"
                value={localNotes}
                onChange={handleNotesChange}
                onBlur={handleNotesBlur}
                onKeyDown={handleKeyDown}
                sx={notesFieldSx}
                minRows={3}
                placeholder="Add your notes and observations..."
                aria-label="Notes input field"
            />
        </Box>
    );
});

NotesTool.displayName = 'NotesTool';

export default NotesTool;

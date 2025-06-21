import React, { useCallback } from 'react';
import { Paper, IconButton, Tooltip, Box } from '@mui/material';
import { NotesIcon } from '../../../../components/icons';
import ChunkTextField from '../../components/ChunkTextField';
import { useNotesTool } from './useNotesTool';
import { NotesToolProps } from '../types';

interface NotesToolComponentProps extends NotesToolProps {
    /** Current summary text */
    summary?: string;
    /** Current notes text */
    notes?: string;
    /** Callback when summary is updated */
    onSummaryUpdate?: (text: string) => void;
    /** Callback when notes are updated */
    onNotesUpdate?: (text: string) => void;
    /** Callback when summary field loses focus */
    onSummaryBlur?: () => void;
    /** Callback when notes field loses focus */
    onNotesBlur?: () => void;
    /** Callback when action completes */
    onComplete?: (success: boolean, result?: any) => void;
    /** Render as compact button only */
    compact?: boolean;
    /** Custom styles for summary field */
    summaryFieldSx?: object;
    /** Custom styles for notes field */
    notesFieldSx?: object;
}

/**
 * Notes/Summary Tool Component
 * Provides note-taking and summary functionality for chunks
 */
const NotesTool: React.FC<NotesToolComponentProps> = ({
    chunkIdx,
    chunk,
    userInput,
    summary = '',
    notes = '',
    onSummaryUpdate,
    onNotesUpdate,
    onSummaryBlur = () => { },
    onNotesBlur = () => { },
    onComplete,
    compact = false,
    summaryFieldSx,
    notesFieldSx
}) => {
    const { updateNotes, loading, error } = useNotesTool();

    const handleSummaryChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        onSummaryUpdate?.(value);
    }, [onSummaryUpdate]);

    const handleNotesChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        onNotesUpdate?.(value);
    }, [onNotesUpdate]);

    const handleUpdate = async (text: string) => {
        const result = await updateNotes({
            chunkIdx,
            chunk,
            userInput: text
        });

        onComplete?.(result.success, result.data);
    };

    if (compact) {
        return (
            <Tooltip title="Notes/Summary tool">
                <IconButton
                    size="small"
                    aria-label="Notes and summary"
                >
                    <NotesIcon style={{ width: 24, height: 24, color: 'currentColor' }} />
                </IconButton>
            </Tooltip>
        );
    }

    return (
        <Box sx={{ p: 1, gap: 2, display: 'flex', flexDirection: 'column', width: '100%', minWidth: 400 }}>
            <ChunkTextField
                label="Summary"
                value={summary}
                onChange={handleSummaryChange}
                onBlur={onSummaryBlur}
                sx={summaryFieldSx}
                disabled={loading}
            />
            <ChunkTextField
                label="Notes"
                value={notes}
                onChange={handleNotesChange}
                onBlur={onNotesBlur}
                sx={notesFieldSx}
                disabled={loading}
            />
            {error && (
                <div style={{ color: 'red', fontSize: '12px' }}>
                    {error}
                </div>
            )}
        </Box>
    );
};

export default NotesTool;

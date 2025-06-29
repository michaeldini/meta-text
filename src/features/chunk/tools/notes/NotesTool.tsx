import React, { useCallback } from 'react';
import { Paper, IconButton, Tooltip, Box, useTheme } from '@mui/material';
import { NotesIcon } from '../../../../components/icons';
import ChunkTextField from '../../../chunk/components/ChunkTextField';
import { useNotesTool } from './useNotesTool';
import { NotesToolProps } from '../types';
import { getToolsStyles } from '../styles/Tools.styles';
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
    summaryFieldSx,
    notesFieldSx
}) => {
    const theme = useTheme();
    const styles = getToolsStyles(theme);
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

    return (
        <Box sx={styles.toolTabContainer}>
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

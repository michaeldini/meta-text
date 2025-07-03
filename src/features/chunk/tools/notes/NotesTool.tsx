import React, { useCallback } from 'react';
import { Box, useTheme } from '@mui/material';

import { ChunkTextField } from '../../../chunk/components';
import { NotesToolProps } from '../types';
import { getToolsStyles } from './Tools.styles';

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
    summary = '',
    notes = '',
    onSummaryUpdate,
    onNotesUpdate,
    onSummaryBlur = () => { },
    onNotesBlur = () => { },
    summaryFieldSx,
    notesFieldSx
}) => {
    const theme = useTheme();
    const styles = getToolsStyles(theme);

    const handleSummaryChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        onSummaryUpdate?.(value);
    }, [onSummaryUpdate]);

    const handleNotesChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        onNotesUpdate?.(value);
    }, [onNotesUpdate]);


    return (
        <Box sx={styles.toolTabContainer}>
            <ChunkTextField
                label="Summary"
                value={summary}
                onChange={handleSummaryChange}
                onBlur={onSummaryBlur}
                sx={summaryFieldSx}
            />
            <ChunkTextField
                label="Notes"
                value={notes}
                onChange={handleNotesChange}
                onBlur={onNotesBlur}
                sx={notesFieldSx}
            />
        </Box>
    );
};

export default NotesTool;

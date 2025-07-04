import React, { useState, useEffect } from 'react';
import { Box, useTheme } from '@mui/material';

import { ChunkTextField } from '../../../chunk/components';
import { getToolsStyles } from './Tools.styles';
import { NotesToolComponentProps } from '../types';

const NotesTool: React.FC<NotesToolComponentProps> = ({
    summary = '',
    notes = '',
    onSummaryBlur = () => { },
    onNotesBlur = () => { },
    summaryFieldSx,
    notesFieldSx
}) => {
    const theme = useTheme();
    const styles = getToolsStyles(theme);

    const [localSummary, setLocalSummary] = useState(summary);
    const [localNotes, setLocalNotes] = useState(notes);

    useEffect(() => { setLocalSummary(summary); }, [summary]);
    useEffect(() => { setLocalNotes(notes); }, [notes]);

    return (
        <Box sx={styles.toolTabContainer}>
            <ChunkTextField
                label="Summary"
                value={localSummary}
                onChange={e => setLocalSummary(e.target.value)}
                onBlur={() => onSummaryBlur(localSummary)}
                sx={summaryFieldSx}
            />
            <ChunkTextField
                label="Notes"
                value={localNotes}
                onChange={e => setLocalNotes(e.target.value)}
                onBlur={() => onNotesBlur(localNotes)}
                sx={notesFieldSx}
            />
        </Box>
    );
};

export default NotesTool;

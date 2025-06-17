import React from 'react';
import ChunkTextField from '../components/ChunkTextField';
import { Paper } from '@mui/material';

interface SummaryNotesComponentProps {
    summary: string;
    notes: string;
    setSummary: (val: string) => void;
    setNotes: (val: string) => void;
    onSummaryBlur: () => void;
    onNotesBlur: () => void;
    summaryFieldSx?: object;
    notesFieldSx?: object;
}

const SummaryNotesComponent: React.FC<SummaryNotesComponentProps> = ({
    summary,
    notes,
    setSummary,
    setNotes,
    onSummaryBlur,
    onNotesBlur,
    summaryFieldSx,
    notesFieldSx,
}) => (
    <Paper elevation={6} sx={{ p: 2, mb: 2, gap: 2, display: 'flex', flexDirection: 'column' }}>
        <ChunkTextField
            label="Summary"
            value={summary}
            onChange={e => setSummary(e.target.value)}
            onBlur={onSummaryBlur}
            sx={summaryFieldSx}
        />
        <ChunkTextField
            label="Notes"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            onBlur={onNotesBlur}
            sx={notesFieldSx}
        />
    </Paper>
);

export default SummaryNotesComponent;

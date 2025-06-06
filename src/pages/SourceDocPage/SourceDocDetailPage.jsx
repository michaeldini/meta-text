import React from 'react';
import { useParams } from 'react-router-dom';
import { Paper, Typography, Box, CircularProgress } from '@mui/material';
import SourceDocInfo from '../../components/SourceDocInfo';
import { useSourceDocument } from '../../hooks/useSourceDocument';

export default function SourceDocDetailPage() {
    const { id } = useParams();
    const { doc, loading, error, setDoc } = useSourceDocument(id);

    // Handler to update doc fields from AI info
    const handleInfoUpdate = aiInfo => {
        setDoc(prev => ({ ...prev, ...aiInfo }));
    };

    return (
        <Box sx={{ maxWidth: 900, mx: 'auto', mt: 4 }}>
            <Typography variant="h4" gutterBottom>{doc?.title}</Typography>
            {doc && (
                <SourceDocInfo
                    doc={doc}
                    onInfoUpdate={handleInfoUpdate}
                />
            )}
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Typography color="error">{error}</Typography>
            ) : doc ? (
                <Paper sx={{ p: 3 }}>
                    <Typography variant="body1" style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
                        {doc.text}
                    </Typography>
                </Paper>
            ) : null}
        </Box>
    );
}

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchSourceDocument } from '../../services/sourceDocumentService';
import { Paper, Typography, Box, CircularProgress } from '@mui/material';

export default function SourceDocDetailPage() {
    const { label } = useParams();
    const [doc, setDoc] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        setLoading(true);
        setError('');
        fetchSourceDocument(label)
            .then(data => setDoc(data))
            .catch(e => setError(e.message || 'Failed to load document.'))
            .finally(() => setLoading(false));
    }, [label]);

    return (
        <Box sx={{ maxWidth: 900, mx: 'auto', mt: 4 }}>
            <Typography variant="h4" gutterBottom>Source Document: {label}</Typography>
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Typography color="error">{error}</Typography>
            ) : doc ? (
                <Paper sx={{ p: 3 }}>
                    <Typography variant="subtitle1" gutterBottom>Label: {doc.label}</Typography>
                    <Typography variant="body1" style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
                        {doc.content}
                    </Typography>
                </Paper>
            ) : null}
        </Box>
    );
}

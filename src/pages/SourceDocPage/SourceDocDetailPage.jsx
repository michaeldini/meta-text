import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchSourceDocument } from '../../services/sourceDocumentService';
import { Paper, Typography, Box, CircularProgress } from '@mui/material';
import SourceDocInfo from '../../components/SourceDocInfo';

export default function SourceDocDetailPage() {
    const { id } = useParams();
    const [doc, setDoc] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        setLoading(true);
        setError('');
        console.log(`Fetching document with ID: ${id}`);
        // Parse id as integer for backend call
        const docId = parseInt(id, 10);
        if (isNaN(docId)) {
            setError('Invalid document ID.');
            setLoading(false);
            return;
        }
        fetchSourceDocument(docId)
            .then(data => setDoc(data))
            .catch(e => setError(e.message || 'Failed to load document.'))
            .finally(() => setLoading(false));
    }, [id]);

    return (
        <Box sx={{ maxWidth: 900, mx: 'auto', mt: 4 }}>
            <Typography variant="h4" gutterBottom>{doc?.title}</Typography>
            {/* Show SourceDocInfo under the title if doc is loaded */}
            {doc && (
                <SourceDocInfo
                    doc={doc}
                    onInfoUpdate={aiInfo => setDoc(prev => ({ ...prev, details: JSON.stringify(aiInfo) }))}
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

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchSourceDocument, generateSourceDocInfo } from '../../services/sourceDocumentService';
import { Paper, Typography, Box, CircularProgress, Alert, Stack } from '@mui/material';
import AiStarsButton from '../../components/AiStarsButton';
import SourceDocDetails from '../../components/SourceDocDetails';

export default function SourceDocDetailPage() {
    const { title } = useParams();
    const [doc, setDoc] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [summaryLoading, setSummaryLoading] = useState(false);
    const [summaryError, setSummaryError] = useState('');

    useEffect(() => {
        setLoading(true);
        setError('');
        fetchSourceDocument(title)
            .then(data => setDoc(data))
            .catch(e => setError(e.message || 'Failed to load document.'))
            .finally(() => setLoading(false));
    }, [title]);

    const handleGenerateSummary = async () => {
        if (!doc) return;
        setSummaryLoading(true);
        setSummaryError('');
        try {
            await generateSourceDocInfo(doc.title, doc.text || doc.content || '');
            // Refetch document to get updated details/summary
            const updated = await fetchSourceDocument(title);
            setDoc(updated);
        } catch (e) {
            setSummaryError(e.message || 'Error generating summary');
        } finally {
            setSummaryLoading(false);
        }
    };

    return (
        <Box sx={{ maxWidth: 900, mx: 'auto', mt: 4 }}>
            <Typography variant="h4" gutterBottom>Source Document: {title}</Typography>
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Typography color="error">{error}</Typography>
            ) : doc ? (
                <Paper sx={{ p: 3 }}>
                    <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                        <Typography variant="subtitle1" gutterBottom sx={{ flex: 1 }}>Title: {doc.title}</Typography>
                        <AiStarsButton
                            loading={summaryLoading}
                            onClick={handleGenerateSummary}
                            label="Generate AI Summary"
                        />
                    </Stack>
                    <SourceDocDetails doc={doc} summaryError={summaryError} />
                    <Typography variant="body1" style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', marginTop: 24 }}>
                        {doc.text}
                    </Typography>
                </Paper>
            ) : null}
        </Box>
    );
}

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchMetaText } from '../../services/metaTextService';
import { Paper, Typography, Box, CircularProgress } from '@mui/material';

export default function MetaTextDetailPage() {
    const { title } = useParams(); // use 'title' param from route
    const [metaText, setMetaText] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        setLoading(true);
        setError('');
        fetchMetaText(title)
            .then(data => setMetaText(data))
            .catch(e => setError(e.message || 'Failed to load meta text.'))
            .finally(() => setLoading(false));
    }, [title]);

    return (
        <Box sx={{ maxWidth: 900, mx: 'auto', mt: 4 }}>
            <Typography variant="h4" gutterBottom>Meta Text: {title}</Typography>
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Typography color="error">{error}</Typography>
            ) : metaText ? (
                <Paper sx={{ p: 3 }}>
                    <Typography variant="subtitle1" gutterBottom>Title: {metaText.title}</Typography>
                    {Array.isArray(metaText.content) ? (
                        metaText.content.map((section, idx) => (
                            <Box key={idx} sx={{ mb: 3, p: 2, border: '1px solid #eee', borderRadius: 2, background: '#fafafa' }}>
                                <Typography variant="subtitle2" gutterBottom>Section {idx + 1}</Typography>
                                {section.content && (
                                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', mb: 1 }}><strong>Content:</strong> {section.content}</Typography>
                                )}
                                {section.summary && (
                                    <Typography variant="body2" sx={{ mb: 1 }}><strong>Summary:</strong> {section.summary}</Typography>
                                )}
                                {section.aiSummary && (
                                    <Typography variant="body2" sx={{ mb: 1 }}><strong>AI Summary:</strong> {section.aiSummary}</Typography>
                                )}
                                {section.notes && (
                                    <Typography variant="body2" sx={{ mb: 1 }}><strong>Notes:</strong> {section.notes}</Typography>
                                )}
                                {section.aiImageUrl && (
                                    <Box sx={{ mt: 1 }}>
                                        <img src={section.aiImageUrl} alt="AI generated" style={{ maxWidth: '100%', borderRadius: 4 }} />
                                    </Box>
                                )}
                            </Box>
                        ))
                    ) : (
                        <Typography variant="body1">{String(metaText.content)}</Typography>
                    )}
                </Paper>
            ) : null}
        </Box>
    );
}

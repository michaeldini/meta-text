import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchMetaText } from '../../services/metaTextService';
import { Paper, Typography, Box, CircularProgress } from '@mui/material';

export default function MetaTextDetailPage() {
    const { label } = useParams();
    const [metaText, setMetaText] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        setLoading(true);
        setError('');
        fetchMetaText(label)
            .then(data => setMetaText(data))
            .catch(e => setError(e.message || 'Failed to load meta text.'))
            .finally(() => setLoading(false));
    }, [label]);

    return (
        <Box sx={{ maxWidth: 900, mx: 'auto', mt: 4 }}>
            <Typography variant="h4" gutterBottom>Meta Text: {label}</Typography>
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Typography color="error">{error}</Typography>
            ) : metaText ? (
                <Paper sx={{ p: 3 }}>
                    <Typography variant="subtitle1" gutterBottom>Name: {metaText.name}</Typography>
                    <Typography variant="body1" style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
                        {JSON.stringify(metaText.sections, null, 2)}
                    </Typography>
                </Paper>
            ) : null}
        </Box>
    );
}

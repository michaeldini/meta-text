import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchMetaText, updateMetaText } from '../../services/metaTextService';
import { Typography, CircularProgress, Box, Alert, Container } from '@mui/material';
import MetaTextSections from '../../components/MetaTextSections';
import { useAutoSave } from '../../hooks/useAutoSave';
import { useMetaTextSectionHandlers } from '../../hooks/useMetaTextSectionHandlers';
import { autoSplitSections } from '../../hooks/useMetaTextSections';

export default function MetaTextDetailPage() {
    const { id } = useParams();
    const [metaText, setMetaText] = useState(null);
    const [sections, setSections] = useState([]);
    const {
        handleWordClick,
        handleRemoveSection,
        handleSectionFieldChange
    } = useMetaTextSectionHandlers(setSections);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [autoSaveStatus, setAutoSaveStatus] = useState('Autosave');

    useEffect(() => {
        setLoading(true);
        setError('');
        fetchMetaText(id)
            .then(data => {
                setMetaText(data);
                const initialSections = Array.isArray(data.content) ? data.content : [{ content: data.content, notes: '', summary: '', aiImageUrl: '', aiSummary: '' }];
                setSections(autoSplitSections(initialSections, 500));
            })
            .catch(e => setError(e.message || 'Failed to load meta text.'))
            .finally(() => setLoading(false));
    }, [id]);

    useAutoSave({
        value: sections,
        delay: 3000,
        onSave: async () => {
            if (!id) return;
            setAutoSaveStatus('Saving...');
            try {
                const splitSections = autoSplitSections(sections, 500);
                await updateMetaText(id, splitSections);
                setAutoSaveStatus('Autosave');
            } catch {
                setAutoSaveStatus('Autosave');
            }
        },
        deps: [id]
    });

    if (loading) {
        return (
            <Box sx={{ maxWidth: 900, mx: 'auto', mt: 4 }}>
                <Typography variant="h4" gutterBottom>Meta Text</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            </Box>
        );
    }
    if (error) {
        return (
            <Box sx={{ maxWidth: 900, mx: 'auto', mt: 4 }}>
                <Typography variant="h4" gutterBottom>Meta Text</Typography>
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }
    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
            <Typography variant="h4" gutterBottom>{metaText?.title || id}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2 }}>
                <Typography variant="body2" color="text.secondary">{autoSaveStatus}</Typography>
            </Box>
            <Box>
                <MetaTextSections
                    sections={sections}
                    handleWordClick={handleWordClick}
                    handleRemoveSection={handleRemoveSection}
                    handleSectionFieldChange={handleSectionFieldChange}
                />
            </Box>
        </Container>
    );
}

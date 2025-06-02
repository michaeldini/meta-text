import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchMetaText, updateMetaText } from '../../services/metaTextService';
import { Typography, CircularProgress, Box, Alert, Paper, Container } from '@mui/material';
import MetaTextSections from '../../components/MetaTextSections';
import { useAutoSave } from '../../hooks/useAutoSave';
import { useMetaTextSectionHandlers } from '../../hooks/useMetaTextSectionHandlers';

export default function MetaTextDetailPage() {

    // Extract ID from URL parameters
    // This ID is used to fetch the specific meta text details
    const { id } = useParams();

    // the meta text response from the server
    const [metaText, setMetaText] = useState(null);

    // the sections of the meta text, initialized as an empty array
    const [sections, setSections] = useState([]);

    // Use custom hook for section handlers
    const {
        handleWordClick,
        handleRemoveSection,
        handleSectionFieldChange
    } = useMetaTextSectionHandlers(setSections);

    // Local state for loading, error, and autosave status
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [autoSaveStatus, setAutoSaveStatus] = useState('Autosave');

    // Fetch meta text and initialize sections
    useEffect(() => {
        setLoading(true);
        setError('');
        fetchMetaText(id)
            .then(data => {
                setMetaText(data);
                setSections(Array.isArray(data.content) ? data.content : []);
            })
            .catch(e => setError(e.message || 'Failed to load meta text.'))
            .finally(() => setLoading(false));
    }, [id]);

    // --- AUTOSAVE LOGIC ---
    useAutoSave({
        value: sections,
        delay: 3000,
        onSave: async () => {
            if (!id) return;
            setAutoSaveStatus('Saving...');
            try {
                await updateMetaText(id, sections);
                setAutoSaveStatus('Autosave');
            } catch {
                setAutoSaveStatus('Autosave');
            }
        },
        deps: [id]
    });

    // Show loading/error states
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

    // --- Modern Material UI layout for sections ---
    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 6 }}>
            <Typography variant="h4" gutterBottom>{metaText?.title || id}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2 }}>
                <Typography variant="body2" color="text.secondary">{autoSaveStatus}</Typography>
            </Box>
            <Box
            >
                {sections.map((section, idx) => (
                    <MetaTextSections
                        key={idx}
                        sections={[section]}
                        handleWordClick={(sectionIdx, wordIdx) => handleWordClick(idx, wordIdx)}
                        handleRemoveSection={() => handleRemoveSection(idx)}
                        handleSectionFieldChange={(sectionIdx, field, value) => handleSectionFieldChange(idx, field, value)}
                    />
                ))}
            </Box>
        </Container>
    );
}

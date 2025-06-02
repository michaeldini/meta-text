import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { fetchMetaText, updateMetaText } from '../../services/metaTextService';
import { Typography, CircularProgress, Box, Alert, Paper, Container } from '@mui/material';
import MetaTextSections from '../../components/MetaTextSections';
import { useAutoSave } from '../../hooks/useAutoSave';

export default function MetaTextDetailPage() {

    // Extract ID from URL parameters
    // This ID is used to fetch the specific meta text details
    const { id } = useParams();

    // the meta text response from the server
    const [metaText, setMetaText] = useState(null);

    // the sections of the meta text, initialized as an empty array
    const [sections, setSections] = useState([]);

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

    // --- Handle word click: split section at word index ---
    const handleWordClick = useCallback((sectionIdx, wordIdx) => {
        setSections(prevSections => {
            const currentSection = prevSections[sectionIdx];
            if (!currentSection || !currentSection.content) return prevSections;
            const words = currentSection.content.split(/\s+/);
            if (wordIdx < 0 || wordIdx >= words.length - 1) return prevSections; // Don't split at last word or out of bounds
            const before = words.slice(0, wordIdx + 1).join(' ');
            const after = words.slice(wordIdx + 1).join(' ');
            if (!before || !after) return prevSections; // Prevent empty sections
            const newSections = [...prevSections];
            // Replace current section with the first part
            newSections[sectionIdx] = {
                ...currentSection,
                content: before
            };
            // Insert the second part as a new section after the current
            newSections.splice(sectionIdx + 1, 0, {
                content: after,
                notes: '',
                summary: '',
                aiImageUrl: ''
            });
            return newSections;
        });
    }, []);

    // --- Remove a section and merge with the next ---
    const handleRemoveSection = useCallback((sectionIdx) => {
        setSections(prevSections => {
            if (sectionIdx >= prevSections.length - 1) return prevSections;
            const mergedContent = prevSections[sectionIdx].content + ' ' + prevSections[sectionIdx + 1].content;
            const newSections = [...prevSections];
            newSections.splice(sectionIdx, 2, {
                ...prevSections[sectionIdx],
                content: mergedContent
            });
            return newSections;
        });
    }, []);

    // --- Handle summary/notes/aiSummary field change ---
    const handleSectionFieldChange = useCallback((sectionIdx, field, value) => {
        setSections(prevSections => {
            const newSections = [...prevSections];
            newSections[sectionIdx] = {
                ...newSections[sectionIdx],
                [field]: value
            };
            return newSections;
        });
    }, []);

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

import React, { useState, useMemo, useCallback } from 'react';
import { createMetaText, updateMetaText } from '../../services/metaTextService';
import { Typography, CircularProgress, Box, Alert, Grow, Fade } from '@mui/material';
import MetaTextSections from '../../components/MetaTextSections';
import { useAutoSave } from '../../hooks/useAutoSave';
import SearchBar from '../../components/SearchBar';
import MetaTextCreateForm from '../../components/MetaTextCreateForm';
import MetaTextList from '../../components/MetaTextList';
import { useMetaTexts } from '../../hooks/useMetaTexts';
import { useSourceDocuments } from '../../hooks/useSourceDocuments';
import { useMetaTextSections } from '../../hooks/useMetaTextSections';

export default function MetaTextPage() {
    const [search, setSearch] = useState('');
    const [selectedSource, setSelectedSource] = useState('');
    const [newLabel, setNewLabel] = useState('');
    const [createError, setCreateError] = useState('');
    const [createSuccess, setCreateSuccess] = useState('');
    const [createLoading, setCreateLoading] = useState(false);
    const [selectedMetaTextId, setSelectedMetaTextId] = useState(null);
    const [autoSaveStatus, setAutoSaveStatus] = useState('Autosave');
    const { metaTexts, metaTextsLoading, metaTextsError } = useMetaTexts([createSuccess]);
    const { docs: sourceDocs, loading: sourceDocsLoading, error: sourceDocsError } = useSourceDocuments();
    // Use custom hook for sections
    const {
        sections,
        setSections,
        sectionsLoading,
        sectionsError
    } = useMetaTextSections(selectedMetaTextId);

    const filteredMetaTexts = useMemo(() => {
        if (!search) return metaTexts;
        return metaTexts.filter(obj => {
            const title = obj.title || '';
            return String(title).toLowerCase().includes(search.toLowerCase());
        });
    }, [metaTexts, search]);

    // Extract options for Autocomplete
    const metaTextOptions = useMemo(() => metaTexts.map(obj => obj.title), [metaTexts]);

    const handleCreate = async e => {
        e.preventDefault();
        setCreateError('');
        setCreateSuccess('');
        setCreateLoading(true);
        try {
            await createMetaText(selectedSource, newLabel);
            setCreateSuccess('Meta-text created!');
            setSelectedSource('');
            setNewLabel('');
        } catch (err) {
            setCreateError(err.message);
        } finally {
            setCreateLoading(false);
        }
    };

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
    }, [setSections]);

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
    }, [setSections]);

    // --- Handle summary/notes field change ---
    const handleSectionFieldChange = useCallback((sectionIdx, field, value) => {
        setSections(prevSections => {
            const newSections = [...prevSections];
            newSections[sectionIdx] = {
                ...newSections[sectionIdx],
                [field]: value
            };
            return newSections;
        });
    }, [setSections]);

    // Replace handleMetaTextClick to set selectedMetaTextId
    const handleMetaTextClick = id => setSelectedMetaTextId(id);

    // --- AUTOSAVE LOGIC ---
    useAutoSave({
        value: sections,
        delay: 1500,
        onSave: async () => {
            if (!selectedMetaTextId) return;
            setAutoSaveStatus('Saving...');
            try {
                await updateMetaText(selectedMetaTextId, sections);
                setAutoSaveStatus('Autosave');
            } catch {
                setAutoSaveStatus('Autosave');
            }
        },
        deps: [selectedMetaTextId]
    });

    return (
        <Box sx={{ maxWidth: 900, mx: 'auto', mt: 4 }}>
            <Typography variant="h4" gutterBottom>Meta Texts</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 2 }}>
                <Typography variant="body2" color="text.secondary">{autoSaveStatus}</Typography>
            </Box>
            <MetaTextCreateForm
                sourceDocs={sourceDocs}
                selectedSource={selectedSource}
                setSelectedSource={setSelectedSource}
                newLabel={newLabel}
                setNewLabel={setNewLabel}
                handleCreate={handleCreate}
                createLoading={createLoading}
                createError={createError}
                createSuccess={createSuccess}
                sourceDocsLoading={sourceDocsLoading}
                sourceDocsError={sourceDocsError}
            />
            <SearchBar
                label="Search Meta Texts"
                value={search}
                onChange={setSearch}
                options={metaTextOptions}
                sx={{ mb: 2 }}
            />
            {metaTextsLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            ) : metaTextsError ? (
                <Alert severity="error">{metaTextsError}</Alert>
            ) : (
                <Box>
                    <MetaTextList
                        filteredMetaTexts={filteredMetaTexts}
                        selectedMetaText={selectedMetaTextId}
                        handleMetaTextClick={handleMetaTextClick}
                    />
                </Box>
            )}
            {/* Section Splitter UI */}
            {selectedMetaTextId && (
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h5" gutterBottom>
                        {metaTexts.find(m => m.id === selectedMetaTextId)?.title || ''}
                    </Typography>
                    {sectionsLoading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                            <CircularProgress />
                        </Box>
                    ) : sectionsError ? (
                        <Alert severity="error">{sectionsError}</Alert>
                    ) : (
                        <MetaTextSections
                            sections={sections}
                            handleWordClick={handleWordClick}
                            handleRemoveSection={handleRemoveSection}
                            handleSectionFieldChange={handleSectionFieldChange}
                        />
                    )}
                </Box>
            )}
        </Box>
    );
}

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { fetchMetaTexts, createMetaText, fetchMetaTextContent, updateMetaText } from '../../services/metaTextService';
import { fetchSourceDocuments } from '../../services/sourceDocumentService';
import { TextField, Paper, Typography, List, ListItem, ListItemButton, ListItemText, CircularProgress, Box, Divider, Button, MenuItem, Select, InputLabel, FormControl, Alert } from '@mui/material';
import SectionSplitter from '../../components/SectionSplitter';
import { useSimpleAutoSave } from '../../hooks/useAutoSave';

export default function MetaTextPage() {
    const [metaTexts, setMetaTexts] = useState([]);
    const [metaTextsLoading, setMetaTextsLoading] = useState(true);
    const [metaTextsError, setMetaTextsError] = useState('');
    const [search, setSearch] = useState('');
    const [sourceDocs, setSourceDocs] = useState([]);
    const [selectedSource, setSelectedSource] = useState('');
    const [newLabel, setNewLabel] = useState('');
    const [createError, setCreateError] = useState('');
    const [createSuccess, setCreateSuccess] = useState('');
    const [createLoading, setCreateLoading] = useState(false);
    const [sections, setSections] = useState([]); // Array of section objects
    const [selectedMetaText, setSelectedMetaText] = useState('');
    const [sectionsLoading, setSectionsLoading] = useState(false);
    const [sectionsError, setSectionsError] = useState('');
    const [autoSaveStatus, setAutoSaveStatus] = useState('Autosave'); // 'Autosave' | 'Saving...'

    // Fetch meta texts
    useEffect(() => {
        setMetaTextsLoading(true);
        setMetaTextsError('');
        fetchMetaTexts()
            .then(data => setMetaTexts(data))
            .catch(e => setMetaTextsError(e.message))
            .finally(() => setMetaTextsLoading(false));
    }, [createSuccess]);

    // Fetch source docs (for dropdown)
    useEffect(() => {
        fetchSourceDocuments()
            .then(data => setSourceDocs(data));
    }, []);

    const filteredMetaTexts = useMemo(() => {
        if (!search) return metaTexts;
        return metaTexts.filter(obj => (obj.name || obj).toLowerCase().includes(search.toLowerCase()));
    }, [metaTexts, search]);

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

    // Fetch sections when a meta-text is selected
    useEffect(() => {
        if (!selectedMetaText) {
            setSections([]);
            return;
        }
        setSectionsLoading(true);
        setSectionsError('');
        fetchMetaTextContent(selectedMetaText)
            .then(data => {
                // Expect content to be an array of section objects
                if (Array.isArray(data.content) && data.content.length > 0 && typeof data.content[0] === 'object') {
                    setSections(data.content);
                } else if (Array.isArray(data.content)) {
                    // fallback for legacy string array
                    setSections(data.content.map(content => ({ content, notes: '', summary: '', aiImageUrl: '' })));
                } else if (typeof data.content === 'string') {
                    setSections([{ content: data.content, notes: '', summary: '', aiImageUrl: '' }]);
                } else {
                    setSections([]);
                }
            })
            .catch(() => {
                setSectionsError('Failed to load meta-text.');
                setSections([]);
            })
            .finally(() => setSectionsLoading(false));
    }, [selectedMetaText]);

    // --- Handle word click: split section at word index ---
    const handleWordClick = useCallback((sectionIdx, wordIdx) => {
        setSections(prevSections => {
            const current = prevSections[sectionIdx];
            const words = current.content.split(/\s+/);
            const before = words.slice(0, wordIdx + 1).join(' ');
            const after = words.slice(wordIdx + 1).join(' ');
            const newSections = [...prevSections];
            newSections.splice(sectionIdx, 1, {
                ...current,
                content: before
            });
            if (after) {
                newSections.splice(sectionIdx + 1, 0, {
                    content: after,
                    notes: '',
                    summary: '',
                    aiImageUrl: ''
                });
            }
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
    }, []);

    // Replace handleMetaTextClick to set selectedMetaText
    const handleMetaTextClick = name => setSelectedMetaText(name);

    // --- AUTOSAVE LOGIC ---
    useSimpleAutoSave({
        value: sections,
        delay: 1500,
        onSave: async () => {
            if (!selectedMetaText) return;
            setAutoSaveStatus('Saving...');
            try {
                await updateMetaText(selectedMetaText, sections);
                setAutoSaveStatus('Autosave');
            } catch {
                setAutoSaveStatus('Autosave');
            }
        },
        deps: [selectedMetaText]
    });

    return (
        <Box sx={{ maxWidth: 900, mx: 'auto', mt: 4 }}>
            <Typography variant="h4" gutterBottom>Meta Texts</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 2 }}>
                <Typography variant="body2" color="text.secondary">{autoSaveStatus}</Typography>
            </Box>
            <Paper sx={{ p: 2, mb: 3 }}>
                <Box component="form" onSubmit={handleCreate} sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                    <FormControl sx={{ minWidth: 200 }}>
                        <InputLabel id="source-doc-label">Source Document</InputLabel>
                        <Select
                            labelId="source-doc-label"
                            value={selectedSource}
                            label="Source Document"
                            onChange={e => setSelectedSource(e.target.value)}
                            required
                        >
                            {sourceDocs.map((doc, idx) => {
                                let key, value, label;
                                if (typeof doc === 'object' && doc !== null) {
                                    key = doc.id || idx;
                                    value = doc.title || String(idx); // use title as value
                                    label = doc.title || String(idx);
                                } else {
                                    key = doc;
                                    value = doc;
                                    label = doc;
                                }
                                return (
                                    <MenuItem key={key} value={value}>{label}</MenuItem>
                                );
                            })}
                        </Select>
                    </FormControl>
                    <TextField
                        label="Meta-text Name"
                        variant="outlined"
                        value={newLabel}
                        onChange={e => setNewLabel(e.target.value)}
                        required
                        sx={{ flexGrow: 1, minWidth: 180 }}
                    />
                    <Button type="submit" variant="contained" disabled={createLoading} sx={{ minWidth: 120 }}>
                        {createLoading ? 'Creating...' : 'Create'}
                    </Button>
                    {createError && <Alert severity="error" sx={{ ml: 2 }}>{createError}</Alert>}
                    {createSuccess && <Alert severity="success" sx={{ ml: 2 }}>{createSuccess}</Alert>}
                </Box>
            </Paper>
            <TextField
                label="Search Meta Texts"
                variant="outlined"
                fullWidth
                value={search}
                onChange={e => setSearch(e.target.value)}
                sx={{ mb: 2 }}
            />
            {metaTextsLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            ) : metaTextsError ? (
                <Alert severity="error">{metaTextsError}</Alert>
            ) : (
                <Paper>
                    <List>
                        {filteredMetaTexts.length === 0 && (
                            <ListItem><ListItemText primary="No meta texts found." /></ListItem>
                        )}
                        {filteredMetaTexts.map(obj => {
                            const name = obj.name || obj;
                            return (
                                <React.Fragment key={name}>
                                    <ListItemButton onClick={() => handleMetaTextClick(name)} selected={selectedMetaText === name}>
                                        <ListItemText primary={name} />
                                    </ListItemButton>
                                    <Divider />
                                </React.Fragment>
                            );
                        })}
                    </List>
                </Paper>
            )}
            {/* Section Splitter UI */}
            {selectedMetaText && (
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h5" gutterBottom>{selectedMetaText}</Typography>
                    {sectionsLoading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                            <CircularProgress />
                        </Box>
                    ) : sectionsError ? (
                        <Alert severity="error">{sectionsError}</Alert>
                    ) : (
                        <SectionSplitter
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

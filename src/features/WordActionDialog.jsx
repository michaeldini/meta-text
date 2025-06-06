import React, { useState } from 'react';
import { Popover, Button, List, ListItem, ListItemButton, ListItemText, Typography, CircularProgress, Alert, Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import SavedSearchIcon from '@mui/icons-material/SavedSearch';
import { lookupWord } from '../services/dictionaryService';
import { fetchDefinitionInContext } from '../services/aiService';

export default function WordActionDialog({ anchorEl, onClose, word, onSplit, onLookupContext }) {
    const [loading, setLoading] = useState(false);
    const [definition, setDefinition] = useState(null);
    const [error, setError] = useState('');
    const [showDefinition, setShowDefinition] = useState(false);
    const [context] = useState(''); // Context for the word (to be provided by parent in future)
    const [definitionWithContext, setDefinitionWithContext] = useState(null);

    const open = Boolean(anchorEl);

    const handleLookupDefinition = async () => {
        setLoading(true);
        setError('');
        setShowDefinition(false);
        try {
            const result = await lookupWord(word);
            setDefinition(result.definition);
            setShowDefinition(true);
        } catch (err) {
            setError(err.message || 'Definition not found');
            setShowDefinition(true);
        } finally {
            setLoading(false);
        }
    };

    const handleFetchDefinitionInContext = async () => {
        setLoading(true);
        setError('');
        setShowDefinition(false);
        setDefinition(null);
        setDefinitionWithContext(null);
        try {
            // For now, use empty string for context. In future, pass real context from parent.
            const result = await fetchDefinitionInContext(word, context);
            setDefinition(result.definition);
            setDefinitionWithContext(result.definitionWithContext);
            setShowDefinition(true);
        } catch (err) {
            setError(err.message || 'Failed to fetch definition in context');
            setShowDefinition(true);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setShowDefinition(false);
        setDefinition(null);
        setError('');
        onClose();
    };

    return (
        <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'center', horizontal: 'right' }}
            transformOrigin={{ vertical: 'center', horizontal: 'left' }}

        >
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: 1 }}>
                <IconButton onClick={onSplit} disabled={loading} title="Split text here" color="primary">
                    <ContentCutIcon fontSize="medium" />
                </IconButton>
                <IconButton onClick={handleLookupDefinition} disabled={loading} title="Look up word definition" color="primary">
                    <AutoStoriesIcon fontSize="medium" />
                    {loading && <CircularProgress size={18} sx={{ position: 'absolute', top: 8, left: 8 }} />}
                </IconButton>
                <IconButton onClick={onLookupContext} disabled title="Look up word in context" color="primary">
                    <SavedSearchIcon fontSize="medium" />
                </IconButton>
                <IconButton onClick={handleFetchDefinitionInContext} disabled={loading} title="AI: Definition in context" color="secondary">
                    <Box component="span" sx={{ fontWeight: 700, fontSize: 18 }}>API</Box>
                </IconButton>
                <IconButton size="small" onClick={handleClose}>
                    <CloseIcon fontSize="small" />
                </IconButton>
            </Box>
            {showDefinition && (
                <Box sx={{ mt: 1 }}>
                    {error ? (
                        <Alert severity="error">{error}</Alert>
                    ) : (
                        <>
                            <Alert severity="info">{definition}</Alert>
                            {definitionWithContext && (
                                <Alert severity="success" sx={{ mt: 1 }}>{definitionWithContext}</Alert>
                            )}
                        </>
                    )}
                </Box>
            )}
        </Popover>
    );
}

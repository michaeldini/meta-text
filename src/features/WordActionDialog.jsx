import React, { useState } from 'react';
import { Popover, Button, List, ListItem, ListItemButton, ListItemText, Typography, CircularProgress, Alert, Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import SavedSearchIcon from '@mui/icons-material/SavedSearch';
import { lookupWord } from '../services/dictionaryService';

export default function WordActionDialog({ anchorEl, onClose, word, onSplit, onLookupContext }) {
    const [loading, setLoading] = useState(false);
    const [definition, setDefinition] = useState(null);
    const [error, setError] = useState('');
    const [showDefinition, setShowDefinition] = useState(false);

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
                <IconButton size="small" onClick={handleClose}>
                    <CloseIcon fontSize="small" />
                </IconButton>
            </Box>
            {showDefinition && (
                <Box sx={{ mt: 1 }}>
                    {error ? (
                        <Alert severity="error">{error}</Alert>
                    ) : (
                        <Alert severity="info">
                            {definition}
                        </Alert>
                    )}
                </Box>
            )}
        </Popover>
    );
}

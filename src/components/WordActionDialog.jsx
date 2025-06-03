import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, List, ListItem, ListItemButton, ListItemText, Typography, CircularProgress, Alert } from '@mui/material';
import { lookupWord } from '../services/dictionaryService';

export default function WordActionDialog({ open, onClose, word, onSplit, onLookupDefinition, onLookupContext }) {
    const [loading, setLoading] = useState(false);
    const [definition, setDefinition] = useState(null);
    const [error, setError] = useState('');
    const [showDefinition, setShowDefinition] = useState(false);

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
        <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
            <DialogTitle>Word Actions</DialogTitle>
            <DialogContent>
                <Typography variant="subtitle1" sx={{ mb: 2 }}>
                    What would you like to do with <b>{word}</b>?
                </Typography>
                <List>
                    <ListItem disablePadding>
                        <ListItemButton onClick={onSplit} disabled={loading}>
                            <ListItemText primary="Split text here" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton onClick={handleLookupDefinition} disabled={loading}>
                            <ListItemText primary="Look up word definition" />
                            {loading && <CircularProgress size={20} sx={{ ml: 2 }} />}
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton onClick={onLookupContext} disabled>
                            <ListItemText primary="Look up word in context" secondary="Coming soon" />
                        </ListItemButton>
                    </ListItem>
                </List>
                {showDefinition && (
                    <>
                        {error ? (
                            <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
                        ) : (
                            <Alert severity="info" sx={{ mt: 2 }}>
                                <b>Definition of {word}:</b><br />
                                {definition}
                            </Alert>
                        )}
                    </>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">Close</Button>
            </DialogActions>
        </Dialog>
    );
}

import React, { useState } from 'react';
import { Popover, Box, IconButton, CircularProgress, Alert } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import { fetchDefinitionInContext } from '../services/aiService';

export default function WordActionDialog({ anchorEl, onClose, word, onSplit, context }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showDefinition, setShowDefinition] = useState(false);
    const [definition, setDefinition] = useState(null);
    const [definitionWithContext, setDefinitionWithContext] = useState(null);

    const open = Boolean(anchorEl);

    const handleFetchDefinitionInContext = async () => {
        setLoading(true);
        setError('');
        setShowDefinition(false);
        setDefinition(null);
        setDefinitionWithContext(null);
        try {
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
        setError('');
        setDefinition(null);
        setDefinitionWithContext(null);
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
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: 1, p: 1 }}>
                <IconButton onClick={onSplit} disabled={loading} title="Split text here" color="primary">
                    <ContentCutIcon fontSize="medium" />
                </IconButton>
                <IconButton onClick={handleFetchDefinitionInContext} disabled={loading} title="AI: Definition in context" color="secondary">
                    <Box component="span" sx={{ fontWeight: 700, fontSize: 18 }}>API</Box>
                    {loading && <CircularProgress size={18} sx={{ position: 'absolute', top: 8, left: 8 }} />}
                </IconButton>
                <IconButton size="small" onClick={handleClose}>
                    <CloseIcon fontSize="small" />
                </IconButton>
            </Box>
            {showDefinition && (
                <Box sx={{ mt: 1, minWidth: 250 }}>
                    {error ? (
                        <Alert severity="error">{error}</Alert>
                    ) : (
                        <>
                            {definition && <Alert severity="info">{definition}</Alert>}
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

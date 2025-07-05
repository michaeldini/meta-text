import React, { useState } from 'react';
import { IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, CircularProgress, Typography, Box, Tooltip } from '@mui/material';

import { CompressionIcon } from 'icons';
import { createChunkCompression, previewChunkCompression } from 'services';
import type { CompressionToolProps } from '../types';

const STYLE_OPTIONS = [
    { value: 'like im 5', label: 'Explain like I’m 5' },
    { value: 'like a bro', label: 'Like a bro' },
    { value: 'academic', label: 'Academic' },
];

const CompressionTool: React.FC<CompressionToolProps> = ({ chunk, onCompressionCreated }) => {
    const [open, setOpen] = useState(false);
    const [style, setStyle] = useState(STYLE_OPTIONS[0].value);
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setPreview(null);
        setError(null);
        setStyle(STYLE_OPTIONS[0].value);
    };

    const handleStyleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setStyle(e.target.value);
        setPreview(null);
        setError(null);
    };

    const handlePreview = async () => {
        if (!chunk) return;
        setLoading(true);
        setError(null);
        try {
            const res = await previewChunkCompression(chunk.id, style);
            setPreview(res.compressed_text);
        } catch (err: any) {
            setError('Failed to generate preview.');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!chunk || !preview) return;
        setSaving(true);
        setError(null);
        try {
            await createChunkCompression(chunk.id, { title: style, compressed_text: preview });
            handleClose();
            if (onCompressionCreated) onCompressionCreated();
        } catch (err: any) {
            setError('Failed to save compression.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            <Tooltip
                title="Compress chunk"
                arrow
                enterDelay={200}
                placement='left'
            >
                <IconButton onClick={handleOpen} size="small" aria-label="Compress chunk" disabled={!chunk}>
                    <CompressionIcon fontSize="small" />
                </IconButton>
            </Tooltip >
            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>Compress Chunk</DialogTitle>
                <DialogContent>
                    <TextField
                        select
                        label="Compression Style"
                        value={style}
                        onChange={handleStyleChange}
                        fullWidth
                        margin="normal"
                    >
                        {STYLE_OPTIONS.map(opt => (
                            <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                        ))}
                    </TextField>
                    <Box mt={2}>
                        <Button onClick={handlePreview} disabled={loading || !style || !chunk} variant="outlined">
                            {loading ? <CircularProgress /> : 'Preview Compression'}
                        </Button>
                    </Box>
                    {preview && (
                        <Box mt={3}>
                            <Typography variant="subtitle2">Preview:</Typography>
                            <Box p={2} borderRadius={1} mt={1}>
                                <Typography variant="body1">{preview}</Typography>
                            </Box>
                        </Box>
                    )}
                    {error && <Typography color="error" mt={2}>{error}</Typography>}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} disabled={saving}>Cancel</Button>
                    <Button onClick={handleSave} disabled={!preview || saving} variant="contained" color="primary">
                        {saving ? <CircularProgress /> : 'Save Compression'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default CompressionTool;

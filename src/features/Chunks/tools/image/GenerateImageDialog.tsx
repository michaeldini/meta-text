import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, LinearProgress, Alert } from '@mui/material';

export interface GenerateImageDialogProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (prompt: string) => void;
    loading?: boolean;
    error?: string | null;
}

const GenerateImageDialog: React.FC<GenerateImageDialogProps> = ({ open, onClose, onSubmit, loading = false, error }) => {
    const [prompt, setPrompt] = useState<string>('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit(prompt);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle>Generate Image</DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <TextField
                        label="Image Prompt"
                        value={prompt}
                        onChange={e => setPrompt(e.target.value)}
                        fullWidth
                        autoFocus
                        multiline
                        minRows={2}
                        disabled={loading}
                    />
                    {loading && <Box sx={{ mt: 2 }}><LinearProgress /></Box>}
                    {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} disabled={loading}>Cancel</Button>
                    <Button type="submit" variant="contained" disabled={loading || !prompt.trim()}>Generate</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default GenerateImageDialog;

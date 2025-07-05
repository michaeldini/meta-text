import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, CircularProgress, Typography } from '@mui/material';
import CompressionStyleSelect from './CompressionStyleSelect';
import CompressionPreview from './CompressionPreview';

interface StyleOption {
    value: string;
    label: string;
}

interface CompressionDialogProps {
    open: boolean;
    onClose: () => void;
    style: string;
    onStyleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    options: StyleOption[];
    onPreview: () => void;
    loading: boolean;
    preview: string | null;
    error: string | null;
    onSave: () => void;
    saving: boolean;
    canPreview: boolean;
    canSave: boolean;
}

const CompressionDialog: React.FC<CompressionDialogProps> = ({
    open, onClose, style, onStyleChange, options, onPreview, loading, preview, error, onSave, saving, canPreview, canSave
}) => (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Compress Chunk</DialogTitle>
        <DialogContent>
            <CompressionStyleSelect style={style} onChange={onStyleChange} options={options} />
            <Box mt={2}>
                <Button onClick={onPreview} disabled={!canPreview} variant="outlined">
                    {loading ? <CircularProgress size={20} /> : 'Preview Compression'}
                </Button>
            </Box>
            <CompressionPreview preview={preview} />
            {error && <Typography color="error" mt={2}>{error}</Typography>}
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose} disabled={saving}>Cancel</Button>
            <Button onClick={onSave} disabled={!canSave} variant="contained" color="primary">
                {saving ? <CircularProgress size={20} /> : 'Save Compression'}
            </Button>
        </DialogActions>
    </Dialog>
);

export default CompressionDialog;

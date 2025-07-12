import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography } from '@mui/material';
import CompressionStyleSelect from './CompressionStyleSelect';
import CompressionPreview from './CompressionPreview';
import { LoadingSpinner } from 'components';
import type { CompressionDialogProps } from 'features/chunk-shared/types';

/**
 * CompressionDialog - A modal dialog for compressing text chunks
 * 
 * This component provides a user interface for:
 * - Selecting compression styles from available options
 * - Previewing the compressed output before saving
 * - Saving the final compression
 * 
 * Features:
 * - Style selection dropdown
 * - Preview generation with loading states
 * - Error handling and display
 * - Save functionality with loading states
 * - Proper button state management (enable/disable based on conditions)
 */
const CompressionDialog: React.FC<CompressionDialogProps> = ({
    open, onClose, style, onStyleChange, options, onPreview, loading, preview, error, onSave, saving, canPreview, canSave
}) => (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Compress Chunk</DialogTitle>
        <DialogContent>
            {/* Compression style selection component */}
            <CompressionStyleSelect style={style} onChange={onStyleChange} options={options} />

            {/* Preview generation section */}
            <Box mt={2}>
                <Button onClick={onPreview} disabled={!canPreview} variant="outlined">
                    {loading ? <LoadingSpinner size={20} minHeight="auto" /> : 'Preview Compression'}
                </Button>
            </Box>

            {/* Preview display component */}
            <CompressionPreview preview={preview} />

            {/* Error message display */}
            {error && <Typography color="error" mt={2}>{error}</Typography>}
        </DialogContent>

        {/* Dialog action buttons */}
        <DialogActions>
            <Button onClick={onClose} disabled={saving}>Cancel</Button>
            <Button onClick={onSave} disabled={!canSave} variant="contained" color="primary">
                {saving ? <LoadingSpinner size={20} minHeight="auto" /> : 'Save Compression'}
            </Button>
        </DialogActions>
    </Dialog>
);

export default CompressionDialog;

import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography } from '@mui/material';
import CompressionStyleSelect from './CompressionStyleSelect';
import { LoadingSpinner } from 'components';
import type { CompressionDialogProps } from 'features/chunk-shared/types';

/**
 * CompressionDialog - A modal dialog for compressing text chunks
 * 
 * This component provides a user interface for:
 * - Selecting compression styles from available options
 * - Generating and saving the compression in one step
 * - Saving the final compression
 * 
 * Features:
 * - Style selection dropdown
 * - Error handling and display
 * - Save functionality with loading states
 * - Proper button state management (enable/disable based on conditions)
 */
const CompressionDialog: React.FC<Pick<CompressionDialogProps, 'open' | 'onClose' | 'style' | 'onStyleChange' | 'options' | 'loading' | 'error' | 'onSave' | 'saving' | 'canSave'>> = ({
    open, onClose, style, onStyleChange, options, loading, error, onSave, saving, canSave
}) => (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Compress Chunk</DialogTitle>
        <DialogContent>
            {/* Compression style selection component */}
            <CompressionStyleSelect style={style} onChange={onStyleChange} options={options} />

            {/* Error message display */}
            {error && <Typography color="error" mt={2}>{error}</Typography>}
        </DialogContent>

        {/* Dialog action buttons */}
        <DialogActions>
            <Button onClick={onClose} disabled={saving}>Cancel</Button>
            <Button onClick={onSave} disabled={!canSave} variant="contained" color="primary">
                {saving ? <LoadingSpinner size={20} minHeight="auto" /> : 'Generate & Save'}
            </Button>
        </DialogActions>
    </Dialog>
);

export default CompressionDialog;

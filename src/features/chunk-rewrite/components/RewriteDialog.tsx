import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography } from '@mui/material';
import RewriteStyleSelect from './RewriteStyleSelect';
import { LoadingSpinner } from 'components';
import type { RewriteDialogProps } from 'features/chunk-shared/types';

/**
 * CompressionDialog - A modal dialog for compressing text chunks
 * 
 * This component provides a user interface for:
 * - Selecting rewrite styles from available options
 * - Generating and saving the rewrite in one step
 * - Saving the final rewrite
 *
 * Features:
 * - Style selection dropdown
 * - Error handling and display
 * - Save functionality with loading states
 * - Proper button state management (enable/disable based on conditions)
 */
const RewriteDialog: React.FC<Pick<RewriteDialogProps, 'open' | 'onClose' | 'style' | 'onStyleChange' | 'options' | 'loading' | 'error' | 'onSave' | 'saving' | 'canSave'>> = ({
    open, onClose, style, onStyleChange, options, loading, error, onSave, saving, canSave
}) => (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Rewrite Chunk</DialogTitle>
        <DialogContent>
            {/* Compression style selection component */}
            <RewriteStyleSelect style={style} onChange={onStyleChange} options={options} />

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

export default RewriteDialog;

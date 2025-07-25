import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography } from '@mui/material';
import RewriteStyleSelect from './RewriteStyleSelect';
import { LoadingSpinner } from 'components';
import type { RewriteDialogProps } from 'features/chunk-shared/types';


export function RewriteDialog({ open, onClose, style, onStyleChange, options, loading, error, onSave, saving, canSave }: Pick<RewriteDialogProps, 'open' | 'onClose' | 'style' | 'onStyleChange' | 'options' | 'loading' | 'error' | 'onSave' | 'saving' | 'canSave'>) {
    return (
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
}

export default RewriteDialog;
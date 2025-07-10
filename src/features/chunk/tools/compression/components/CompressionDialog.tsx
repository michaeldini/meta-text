import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography } from '@mui/material';
import CompressionStyleSelect from './CompressionStyleSelect';
import CompressionPreview from './CompressionPreview';
import { LoadingSpinner } from 'components';

/**
 * Configuration object for compression style options
 */
interface StyleOption {
    /** The internal value used for the compression style */
    value: string;
    /** The human-readable label displayed to the user */
    label: string;
}

/**
 * Props interface for the CompressionDialog component
 */
interface CompressionDialogProps {
    /** Controls whether the dialog is open or closed */
    open: boolean;
    /** Callback function to close the dialog */
    onClose: () => void;
    /** The currently selected compression style */
    style: string;
    /** Callback function to handle style selection changes */
    onStyleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    /** Array of available compression style options */
    options: StyleOption[];
    /** Callback function to trigger compression preview generation */
    onPreview: () => void;
    /** Loading state for preview generation */
    loading: boolean;
    /** The generated preview text (null if no preview available) */
    preview: string | null;
    /** Error message (null if no error) */
    error: string | null;
    /** Callback function to save the compression */
    onSave: () => void;
    /** Loading state for save operation */
    saving: boolean;
    /** Whether the preview button should be enabled */
    canPreview: boolean;
    /** Whether the save button should be enabled */
    canSave: boolean;
}

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

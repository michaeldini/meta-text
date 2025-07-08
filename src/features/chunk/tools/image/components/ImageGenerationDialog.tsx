import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    LinearProgress,
    Alert
} from '@mui/material';

interface ImageGenerationDialogProps {
    open: boolean;
    prompt: string;
    loading: boolean;
    error: string | null;
    onClose: () => void;
    onPromptChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const ImageGenerationDialog: React.FC<ImageGenerationDialogProps> = ({
    open,
    prompt,
    loading,
    error,
    onClose,
    onPromptChange,
    onSubmit
}) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle>Generate Image</DialogTitle>
            <form onSubmit={onSubmit}>
                <DialogContent>
                    <TextField
                        label="Image Prompt"
                        value={prompt}
                        onChange={onPromptChange}
                        fullWidth
                        autoFocus
                        multiline
                        minRows={2}
                        disabled={loading}
                        placeholder="Describe the image you want to generate..."
                    />
                    {loading && (
                        <Box sx={{ mt: 2 }}>
                            <LinearProgress />
                        </Box>
                    )}
                    {error && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            {error}
                        </Alert>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={loading || !prompt.trim()}
                    >
                        Generate
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default ImageGenerationDialog;

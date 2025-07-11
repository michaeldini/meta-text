/**
 * ImageGenerationDialog Component
 * 
 * A modal dialog for inputting image generation prompts with enhanced UX features.
 * Provides real-time validation, character counting, and improved accessibility.
 */
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
    Typography,
    Chip,
} from '@mui/material';
import { AppAlert } from 'components';
import type { ImageGenerationDialogProps } from '../../types';

// Constants for prompt validation
const MIN_PROMPT_LENGTH = 3;
const MAX_PROMPT_LENGTH = 1000;
const SUGGESTED_PROMPTS = [
    'A serene landscape with mountains',
    'Abstract geometric patterns',
    'Vintage illustration style',
    'Modern minimalist design',
    'Watercolor painting style'
];

const ImageGenerationDialog: React.FC<ImageGenerationDialogProps> = ({
    open,
    prompt,
    loading,
    error,
    onClose,
    onPromptChange,
    onSubmit
}) => {
    const promptLength = prompt.length;
    const isPromptValid = promptLength >= MIN_PROMPT_LENGTH && promptLength <= MAX_PROMPT_LENGTH;
    const isPromptTooLong = promptLength > MAX_PROMPT_LENGTH;

    const handleSuggestedPromptClick = (suggestedPrompt: string) => {
        const syntheticEvent = {
            target: { value: suggestedPrompt }
        } as React.ChangeEvent<HTMLInputElement>;
        onPromptChange(syntheticEvent);
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            aria-labelledby="image-generation-dialog-title"
        >
            <DialogTitle id="image-generation-dialog-title">
                Generate AI Image
            </DialogTitle>
            <form onSubmit={onSubmit}>
                <DialogContent>
                    <TextField
                        label="Image Prompt"
                        value={prompt}
                        onChange={onPromptChange}
                        fullWidth
                        autoFocus
                        multiline
                        minRows={3}
                        maxRows={6}
                        disabled={loading}
                        placeholder="Describe the image you want to generate in detail..."
                        error={isPromptTooLong}
                        helperText={
                            isPromptTooLong
                                ? `Prompt is too long (${promptLength}/${MAX_PROMPT_LENGTH} characters)`
                                : `${promptLength}/${MAX_PROMPT_LENGTH} characters`
                        }
                        sx={{ mb: 2 }}
                    />

                    {/* Suggested prompts */}
                    {promptLength === 0 && (
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                Suggested prompts:
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {SUGGESTED_PROMPTS.map((suggestion, index) => (
                                    <Chip
                                        key={index}
                                        label={suggestion}
                                        onClick={() => handleSuggestedPromptClick(suggestion)}
                                        size="small"
                                        variant="outlined"
                                        sx={{ cursor: 'pointer' }}
                                    />
                                ))}
                            </Box>
                        </Box>
                    )}

                    {loading && (
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                Generating your image...
                            </Typography>
                            <LinearProgress />
                        </Box>
                    )}

                    {error && (
                        <Box sx={{ mt: 2 }}>
                            <AppAlert severity="error">
                                {error}
                            </AppAlert>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={loading || !isPromptValid}
                        sx={{ minWidth: 100 }}
                    >
                        {loading ? 'Generating...' : 'Generate'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default ImageGenerationDialog;

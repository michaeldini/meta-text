import React, { useState } from 'react';
import { IconButton, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, LinearProgress, Alert, useTheme } from '@mui/material';
import { PhotoFilterIcon } from '../../../../components/icons';
import { useImageTool } from './useImageTool';
import { ImageToolProps } from '../types';
import ChunkImageModal from './Modal';
import AiGenerationButton from '../../../../components/AiGenerationButton';
import type { Chunk } from '../../../../types/chunk';
import { getToolsStyles } from '../styles/styles';

interface ImageToolComponentProps extends ImageToolProps {
    /** Callback when action completes */
    onComplete?: (success: boolean, result?: any) => void;
    /** Render as compact button only */
    compact?: boolean;
}

/**
 * Image Tool Component
 * Generates AI images for chunks
 */
const ImageTool: React.FC<ImageToolComponentProps> = ({
    chunkIdx,
    chunk,
    prompt: initialPrompt = '',
    onComplete,
    compact = false
}) => {
    const {
        generateImage,
        state,
        getImgSrc,
        setLightboxOpen,
        setImageLoaded,
        openDialog,
        closeDialog,
        handlePromptChange,
        loading,
        error
    } = useImageTool(chunk as Chunk);

    const [localPrompt, setLocalPrompt] = useState(initialPrompt);
    const theme = useTheme();
    const styles = getToolsStyles(theme);
    const handleGenerate = async () => {
        const result = await generateImage({
            chunkIdx,
            chunk,
            prompt: localPrompt || state.prompt
        });

        onComplete?.(result.success, result.data);
    };

    const handleDialogSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await handleGenerate();
    };

    const handlePromptChangeLocal = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalPrompt(e.target.value);
        handlePromptChange(e);
    };

    if (compact) {
        return (
            <Tooltip title="Generate AI image">
                <IconButton
                    onClick={openDialog}
                    disabled={loading}
                    size="small"
                    aria-label="Generate AI image"
                >
                    <PhotoFilterIcon style={{ width: 24, height: 24, color: 'currentColor' }} />
                </IconButton>
            </Tooltip>
        );
    }

    return (
        <>
            <Box sx={styles.toolTabContainer}>
                <AiGenerationButton
                    label="Generate Image"
                    toolTip="Generate an image for this chunk using AI"
                    loading={loading}
                    onClick={openDialog}
                    disabled={loading}
                />
                {/* Modal for full-size image */}
                {state.data && (
                    <ChunkImageModal
                        imgSrc={getImgSrc()}
                        imgPrompt={state.prompt}
                        imgLoaded={state.loaded}
                        onLoad={() => setImageLoaded(true)}
                        onError={() => setImageLoaded(true)}
                        lightboxOpen={state.lightboxOpen}
                        setLightboxOpen={setLightboxOpen}
                    />
                )}
            </Box>

            <Dialog open={state.dialogOpen} onClose={closeDialog} maxWidth="xs" fullWidth>
                <DialogTitle>Generate Image</DialogTitle>
                <form onSubmit={handleDialogSubmit}>
                    <DialogContent>
                        <TextField
                            label="Image Prompt"
                            value={state.prompt}
                            onChange={handlePromptChangeLocal}
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
                        <Button onClick={closeDialog} disabled={loading}>Cancel</Button>
                        <Button type="submit" variant="contained" disabled={loading || !state.prompt.trim()}>Generate</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    );
};

export default ImageTool;

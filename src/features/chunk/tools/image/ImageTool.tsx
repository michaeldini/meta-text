import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, LinearProgress, Alert, useTheme } from '@mui/material';

import { AiGenerationButton } from 'components';

import { useImageTool } from './useImageTool';
import ChunkImageModal from './components/Modal';
import { getSharedToolStyles } from '../shared.styles';
import { ImageToolComponentProps } from '../types';

const ImageTool: React.FC<ImageToolComponentProps> = ({
    chunk,
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
    } = useImageTool(chunk);

    const theme = useTheme();
    const styles = getSharedToolStyles(theme);

    const handleGenerate = async () => {
        const result = await generateImage({
            chunk,
            prompt: state.prompt
        });

    };

    const handleDialogSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await handleGenerate();
    };

    const handlePromptChangeLocal = (e: React.ChangeEvent<HTMLInputElement>) => {
        handlePromptChange(e);
    };

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

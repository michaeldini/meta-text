import React from 'react';
import { Box, useTheme } from '@mui/material';

import { AiGenerationButton } from 'components';

import { useImageTool } from './useImageTool';
import ImageDisplay from './components/ImageDisplay';
import ImageGenerationDialog from './components/ImageGenerationDialog';
import { getSharedToolStyles } from '../shared.styles';
import { ImageToolProps } from '../types';

const ImageTool: React.FC<ImageToolProps> = ({
    chunk,
}) => {
    const {
        generateImage,
        state,
        getImgSrc,
        openDialog,
        closeDialog,
        handlePromptChange,
        loading,
        error
    } = useImageTool(chunk);

    const theme = useTheme();
    const styles = getSharedToolStyles(theme);

    const handleDialogSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await generateImage({
            chunk,
            prompt: state.prompt
        });
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
                    <ImageDisplay
                        src={getImgSrc()}
                        alt={state.prompt}
                        height="300px"
                        showModal={true}
                    />
                )}
            </Box>

            <ImageGenerationDialog
                open={state.dialogOpen}
                prompt={state.prompt}
                loading={loading}
                error={error}
                onClose={closeDialog}
                onPromptChange={handlePromptChange}
                onSubmit={handleDialogSubmit}
            />
        </>
    );
};

export default ImageTool;

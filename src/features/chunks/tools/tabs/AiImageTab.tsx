import React from 'react';
import ChunkImageDisplay from '../image/Display';
import GenerateImageDialog from '../image/Generate';
import { useImageGeneration } from '../image/useImageGeneration';
import { useImageGenerationHandler } from '../image/useImageGenerationHandler';
import type { Chunk } from '../../../../types/chunk';

interface AiImageTabProps {
    chunk: Chunk;
}

const AiImageTab: React.FC<AiImageTabProps> = ({ chunk }) => {
    // Image state and handlers
    const { state: imageState, setState: setImageState, getImgSrc } = useImageGeneration(chunk);
    const setLightboxOpen = React.useCallback((open: boolean) => setImageState(s => ({ ...s, lightboxOpen: open })), [setImageState]);
    const setImageLoaded = React.useCallback((loaded: boolean) => setImageState(s => ({ ...s, loaded })), [setImageState]);

    // Dialog and image generation handler
    const { dialog, handleDialogSubmit } = useImageGenerationHandler(chunk, setImageState);

    return (
        <>
            <ChunkImageDisplay
                imageState={imageState}
                getImgSrc={getImgSrc}
                setImageLoaded={setImageLoaded}
                setLightboxOpen={setLightboxOpen}
                imgPrompt={imageState.prompt}
                openDialog={dialog.openDialog}
            />
            <GenerateImageDialog
                open={dialog.dialogOpen}
                onClose={dialog.closeDialog}
                onSubmit={handleDialogSubmit}
                loading={dialog.loading}
                error={dialog.error}
                prompt={dialog.prompt}
                onPromptChange={dialog.handlePromptChange}
            />
        </>
    );
};

export default AiImageTab;

import React from 'react';
import ChunkImageDisplay from '../image/Display';
import GenerateImageDialog from '../image/Generate';
import { useAiImageTool } from '../image/useAiImageTool';
import type { Chunk } from '../../../../types/chunk';

interface AiImageTabProps {
    chunk: Chunk;
}

const AiImageTab: React.FC<AiImageTabProps> = ({ chunk }) => {
    const {
        state,
        getImgSrc,
        setLightboxOpen,
        setImageLoaded,
        openDialog,
        closeDialog,
        handlePromptChange,
        handleDialogSubmit,
    } = useAiImageTool(chunk);

    return (
        <>
            <ChunkImageDisplay
                imageState={state}
                getImgSrc={getImgSrc}
                setImageLoaded={setImageLoaded}
                setLightboxOpen={setLightboxOpen}
                imgPrompt={state.prompt}
                openDialog={openDialog}
            />
            <GenerateImageDialog
                open={state.dialogOpen}
                onClose={closeDialog}
                onSubmit={handleDialogSubmit}
                loading={state.loading}
                error={state.error}
                prompt={state.prompt}
                onPromptChange={handlePromptChange}
            />
        </>
    );
};

export default AiImageTab;

import React from 'react';
import ChunkImageDisplay from '../image/Display';
import GenerateImageDialog from '../image/Generate';
import type { Chunk } from '../../../../types/chunk';

interface AiImageTabProps {
    imageState: any;
    getImgSrc: () => string;
    setImageLoaded: (loaded: boolean) => void;
    setLightboxOpen: (open: boolean) => void;
    dialog: any;
    handleDialogSubmit: (prompt: string) => void;
}

const AiImageTab: React.FC<AiImageTabProps> = ({
    imageState,
    getImgSrc,
    setImageLoaded,
    setLightboxOpen,
    dialog,
    handleDialogSubmit,
}) => (
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

export default AiImageTab;

import React from 'react';
import { Paper } from '@mui/material';
import AiGenerationButton from '../../components/AiGenerationButton';
import ChunkImageDisplay from './ChunkImageDisplay';
import { toolStyles } from './Chunks.styles';
import { AiGenerationBtn } from '../../components/AiGenerationBtn';

interface ChunkImagePanelProps {
    imageState: any;
    openDialog: () => void;
    getImgSrc: () => string;
    setImageLoaded: (loaded: boolean) => void;
    setLightboxOpen: (open: boolean) => void;
    imgPrompt: string;
    createdAt?: string;
}

const ChunkImagePanel: React.FC<ChunkImagePanelProps> = ({
    imageState,
    openDialog,
    getImgSrc,
    setImageLoaded,
    setLightboxOpen,
    imgPrompt,
    createdAt,
}) => (
    <Paper sx={toolStyles}>
        <AiGenerationButton
            label="Generate Image"
            toolTip="Generate an image for this chunk using AI"
            loading={imageState.loading}
            onClick={openDialog}
            disabled={imageState.loading}
            sx={{ ...AiGenerationBtn, opacity: imageState.loading ? 0.7 : 1 }}
        />
        {imageState.data && (
            <ChunkImageDisplay
                imgSrc={getImgSrc()}
                imgPrompt={imgPrompt}
                imgLoaded={imageState.loaded}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageLoaded(true)}
                lightboxOpen={imageState.lightboxOpen}
                setLightboxOpen={setLightboxOpen}
                createdAt={createdAt}
            />
        )}
    </Paper>
);

export default ChunkImagePanel;

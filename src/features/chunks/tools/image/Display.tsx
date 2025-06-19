import React from 'react';
import { Paper, Button } from '@mui/material';
import ChunkImageModal from './Modal';
import { toolStyles } from '../../styles/styles';
import AiGenerationButton from '../../../../components/AiGenerationButton';

interface ChunkImageDisplayProps {
    imageState: any;
    openDialog: () => void;
    getImgSrc: () => string;
    setImageLoaded: (loaded: boolean) => void;
    setLightboxOpen: (open: boolean) => void;
    imgPrompt: string;
}

const ChunkImageDisplay: React.FC<ChunkImageDisplayProps> = ({
    imageState,
    openDialog,
    getImgSrc,
    setImageLoaded,
    setLightboxOpen,
    imgPrompt,
}) => (
    <Paper sx={toolStyles}>
        <AiGenerationButton
            label="Generate Image"
            toolTip="Generate an image for this chunk using AI"
            loading={imageState.loading}
            onClick={openDialog}
            disabled={imageState.loading}
            sx={{ opacity: imageState.loading ? 0.7 : 1 }}
        />
        {imageState.data && (
            <ChunkImageModal
                imgSrc={getImgSrc()}
                imgPrompt={imgPrompt}
                imgLoaded={imageState.loaded}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageLoaded(true)}
                lightboxOpen={imageState.lightboxOpen}
                setLightboxOpen={setLightboxOpen}
            />
        )}
    </Paper>
);

export default ChunkImageDisplay;

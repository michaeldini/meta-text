import React from 'react';
import { Box, Paper } from '@mui/material';
import { TextSizeInput, LineHeightInput, PaddingXInput, FontFamilySelect } from 'components';
import ChunkPositionToggleButton from '../../features/chunk-position/ChunkPositionToggleButton';

const StyleControls: React.FC = () => {
    return (
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextSizeInput />
            <LineHeightInput />
            <PaddingXInput />
            <FontFamilySelect />
            <ChunkPositionToggleButton />
        </Box>
    );
};

export default StyleControls;

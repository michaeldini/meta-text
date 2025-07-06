import React from 'react';
import { Box } from '@mui/material';
import { TextSizeInput, LineHeightInput, FontFamilySelect } from 'components';

const StyleControls: React.FC = () => {
    return (
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextSizeInput />
            <LineHeightInput />
            <FontFamilySelect />
        </Box>
    );
};

export default StyleControls;

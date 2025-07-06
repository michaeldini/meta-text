import React from 'react';
import { Box, Paper } from '@mui/material';
import { TextSizeInput, LineHeightInput, FontFamilySelect } from 'components';

const StyleControls: React.FC = () => {
    return (
        <Paper sx={{ display: 'flex', gap: 2, alignItems: 'center', padding: 2 }}>
            <TextSizeInput />
            <LineHeightInput />
            <FontFamilySelect />
        </Paper>
    );
};

export default StyleControls;

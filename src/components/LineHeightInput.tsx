import React from 'react';
import { Slider, Box, Typography } from '@mui/material';
import { useUIPreferencesStore } from 'store/uiPreferences';

const MIN_LINE_HEIGHT = 1.0;
const MAX_LINE_HEIGHT = 2.5;
const STEP = 0.05;

const LineHeightInput: React.FC = () => {
    const lineHeight = useUIPreferencesStore(state => state.lineHeight);
    const setLineHeight = useUIPreferencesStore(state => state.setLineHeight);

    return (
        <Box sx={{ minWidth: 120, mx: 2 }}>
            <Typography variant="caption" color="text.secondary" gutterBottom>
                Line Height
            </Typography>
            <Slider
                value={lineHeight}
                min={MIN_LINE_HEIGHT}
                max={MAX_LINE_HEIGHT}
                step={STEP}
                onChange={(_, value) => setLineHeight(Number(value))}
                valueLabelDisplay="auto"
                aria-label="Line Height"
            />
        </Box>
    );
};

export default LineHeightInput;

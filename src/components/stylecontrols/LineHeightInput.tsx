import React from 'react';
import { Slider, Box, Typography } from '@mui/material';
import { useUIPreferences, useUpdateUIPreferences } from 'store/uiPreferences';

const MIN_LINE_HEIGHT = 1.0;
const MAX_LINE_HEIGHT = 2.5;
const STEP = 0.05;

const LineHeightInput: React.FC = () => {

    const { lineHeight } = useUIPreferences();
    const updateUIPreferences = useUpdateUIPreferences();

    const handleChange = (_: Event, value: number | number[]) => {
        updateUIPreferences.mutate({ lineHeight: Number(value) });
    };

    return (
        <Box>
            <Typography variant="caption" color="text.secondary" gutterBottom>
                Line Height
            </Typography>
            <Slider
                value={lineHeight}
                min={MIN_LINE_HEIGHT}
                max={MAX_LINE_HEIGHT}
                step={STEP}
                onChange={handleChange}
                valueLabelDisplay="auto"
                aria-label="Line Height"
                disabled={updateUIPreferences.status === 'pending'}
            />
        </Box>
    );
};

export default LineHeightInput;

import React from 'react';
import { Slider, Box, Typography } from '@mui/material';
import { useUIPreferences, useUpdateUIPreferences } from 'store/uiPreferences';

const MIN_PADDING_X = 0.1;
const MAX_PADDING_X = 0.8;
const STEP = 0.1;

const PaddingXInput: React.FC = () => {

    const { paddingX } = useUIPreferences();
    const updateUIPreferences = useUpdateUIPreferences();

    const handleChange = (_: Event, value: number | number[]) => {
        updateUIPreferences.mutate({ paddingX: Number(value) });
    };

    return (
        <Box>
            <Typography variant="caption" color="text.secondary" gutterBottom>
                Padding X ({paddingX}rem)
            </Typography>
            <Slider
                value={paddingX}
                min={MIN_PADDING_X}
                max={MAX_PADDING_X}
                step={STEP}
                onChange={handleChange}
                valueLabelDisplay="auto"
                aria-label="Padding X"
                disabled={updateUIPreferences.status === 'pending'}
            />
        </Box>
    );
};

export default PaddingXInput;

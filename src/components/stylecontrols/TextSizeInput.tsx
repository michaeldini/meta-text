import React from 'react';
import { Slider, Box, Typography } from '@mui/material';
import { useUIPreferences, useUpdateUIPreferences } from 'store/uiPreferences';

const MIN_SIZE = 8;
const MAX_SIZE = 72;
const STEP = 1;

const TextSizeInput: React.FC = () => {

    const { textSizePx } = useUIPreferences();
    const updateUIPreferences = useUpdateUIPreferences();

    const handleChange = (_: Event, value: number | number[]) => {
        updateUIPreferences.mutate({ textSizePx: Number(value) });
    };

    return (
        <Box>
            <Typography variant="caption" color="text.secondary" gutterBottom>
                Text Size ({textSizePx}px)
            </Typography>
            <Slider
                value={textSizePx}
                min={MIN_SIZE}
                max={MAX_SIZE}
                step={STEP}
                onChange={handleChange}
                valueLabelDisplay="auto"
                aria-label="Text Size"
                disabled={updateUIPreferences.status === 'pending'}
            />
        </Box>
    );
};

export default TextSizeInput;

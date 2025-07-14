import React from 'react';
import { Slider, Box, Typography } from '@mui/material';
import { useUIPreferencesStore } from 'store/uiPreferences';

const MIN_PADDING_X = 0.1;
const MAX_PADDING_X = 0.8;
const STEP = 0.1;

const PaddingXInput: React.FC = () => {
    const paddingX = useUIPreferencesStore(state => state.paddingX);
    const setPaddingX = useUIPreferencesStore(state => state.setPaddingX);

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
                onChange={(_, value) => setPaddingX(Number(value))}
                valueLabelDisplay="auto"
                aria-label="Padding X"
            />
        </Box>
    );
};

export default PaddingXInput;

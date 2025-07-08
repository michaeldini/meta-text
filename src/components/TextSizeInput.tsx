import React from 'react';
import { Slider, Box, Typography } from '@mui/material';
import { useUIPreferencesStore } from '../store/uiPreferences';

const MIN_SIZE = 8;
const MAX_SIZE = 72;
const STEP = 1;

const TextSizeInput: React.FC = () => {
    const textSizePx = useUIPreferencesStore(state => state.textSizePx);
    const setTextSizePx = useUIPreferencesStore(state => state.setTextSizePx);

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
                onChange={(_, value) => setTextSizePx(Number(value))}
                valueLabelDisplay="auto"
                aria-label="Text Size"
            />
        </Box>
    );
};

export default TextSizeInput;

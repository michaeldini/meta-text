import React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { useUIPreferencesStore } from '../store/uiPreferences';
import { ExpandMoreIcon, ExpandLessIcon } from '../components/icons';

const MIN_SIZE = 8;
const MAX_SIZE = 72;
const STEP = 1;

const TextSizeInput: React.FC = () => {
    const textSizePx = useUIPreferencesStore(state => state.textSizePx);
    const setTextSizePx = useUIPreferencesStore(state => state.setTextSizePx);

    const handleIncrease = () => {
        setTextSizePx(Math.min(textSizePx + STEP, MAX_SIZE));
    };
    const handleDecrease = () => {
        setTextSizePx(Math.max(textSizePx - STEP, MIN_SIZE));
    };
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = Number(e.target.value);
        if (!isNaN(val)) {
            setTextSizePx(Math.max(MIN_SIZE, Math.min(val, MAX_SIZE)));
        }
    };

    return (
        <Box display="flex" alignItems="center" sx={{ ml: 2 }}>
            <IconButton size="small" onClick={handleDecrease} disabled={textSizePx <= MIN_SIZE} aria-label="Decrease text size">
                <ExpandMoreIcon fontSize="small" />
            </IconButton>
            <Typography variant="body1" sx={{ mx: 1, minWidth: 32, textAlign: 'center' }}>
                {textSizePx} <span style={{ fontSize: 12, color: '#888' }}>px</span>
            </Typography>
            <IconButton size="small" onClick={handleIncrease} disabled={textSizePx >= MAX_SIZE} aria-label="Increase text size">
                <ExpandLessIcon fontSize="small" />
            </IconButton>
            <input
                type="number"
                value={textSizePx}
                min={MIN_SIZE}
                max={MAX_SIZE}
                step={STEP}
                onChange={handleInputChange}
                style={{
                    width: 0,
                    height: 0,
                    opacity: 0,
                    position: 'absolute',
                    pointerEvents: 'none',
                }}
                tabIndex={-1}
                aria-hidden="true"
            />
        </Box>
    );
};

export default TextSizeInput;

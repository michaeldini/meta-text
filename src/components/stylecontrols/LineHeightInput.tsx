import React from 'react';
import { Slider, Box, Typography } from '@mui/material';

const MIN_LINE_HEIGHT = 1.0;
const MAX_LINE_HEIGHT = 2.5;
const STEP = 0.05;

interface LineHeightInputProps {
    value: number;
    onChange: (val: number) => void;
    disabled?: boolean;
}


export function LineHeightInput(props: LineHeightInputProps) {
    const { value, onChange, disabled } = props;
    const handleChange = (_: Event, newValue: number | number[]) => {
        onChange(Number(newValue));
    };
    return (
        <Box>
            <Typography variant="caption" color="text.secondary" gutterBottom>
                Line Height ({value})
            </Typography>
            <Slider
                value={value}
                min={MIN_LINE_HEIGHT}
                max={MAX_LINE_HEIGHT}
                step={STEP}
                onChange={handleChange}
                valueLabelDisplay="auto"
                aria-label="Line Height"
                disabled={disabled}
            />
        </Box>
    );
}

export default LineHeightInput;

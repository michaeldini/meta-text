import React from 'react';
import { Slider, Box, Typography } from '@mui/material';


const MIN_PADDING_X = 0.1;
const MAX_PADDING_X = 0.8;
const STEP = 0.1;


interface PaddingXInputProps {
    value: number;
    onChange: (val: number) => void;
    disabled?: boolean;
}

export function PaddingXInput(props: PaddingXInputProps) {
    const { value, onChange, disabled } = props;
    const handleChange = (_: Event, newValue: number | number[]) => {
        onChange(Number(newValue));
    };
    return (
        <Box>
            <Typography variant="caption" color="text.secondary" gutterBottom>
                Padding X ({value}rem)
            </Typography>
            <Slider
                value={value}
                min={MIN_PADDING_X}
                max={MAX_PADDING_X}
                step={STEP}
                onChange={handleChange}
                valueLabelDisplay="auto"
                aria-label="Padding X"
                disabled={disabled}
            />
        </Box>
    );
}

export default PaddingXInput;

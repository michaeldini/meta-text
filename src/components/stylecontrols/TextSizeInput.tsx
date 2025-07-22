
import React from 'react';
import { Slider, Box, Typography } from '@mui/material';

const MIN_SIZE = 8;
const MAX_SIZE = 72;
const STEP = 1;


interface TextSizeInputProps {
    value: number;
    onChange: (val: number) => void;
    disabled?: boolean;
}


export function TextSizeInput(props: TextSizeInputProps) {
    const { value, onChange, disabled } = props;
    const handleChange = (_: Event, newValue: number | number[]) => {
        onChange(Number(newValue));
    };
    return (
        <Box>
            <Typography variant="caption" color="text.secondary" gutterBottom>
                Text Size ({value}px)
            </Typography>
            <Slider
                value={value}
                min={MIN_SIZE}
                max={MAX_SIZE}
                step={STEP}
                onChange={handleChange}
                valueLabelDisplay="auto"
                aria-label="Text Size"
                disabled={disabled}
            />
        </Box>
    );
}

export default TextSizeInput;

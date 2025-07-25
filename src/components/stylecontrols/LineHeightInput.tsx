// LineHeightInput: Slider input for line height, using Chakra UI. See TextSizeInput for style reference.
import React from 'react';
import { Box, Text } from '@chakra-ui/react';
import { Slider } from 'components';

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
    // Chakra UI style, see TextSizeInput for reference
    return (
        <Box>
            <Text fontSize="sm" color="primary" mb={2}>
                Line Height ({value})
            </Text>
            <Slider
                defaultValue={[value]}
                min={MIN_LINE_HEIGHT}
                max={MAX_LINE_HEIGHT}
                step={STEP}
                onChange={val => onChange(Array.isArray(val) ? val[0] : val)}
                aria-label={["Line Height"]}
                disabled={disabled}
                colorPalette={"blue"}
            />
        </Box>
    );
}

export default LineHeightInput;

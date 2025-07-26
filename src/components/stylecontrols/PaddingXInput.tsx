// PaddingXInput: Slider input for horizontal padding, using Chakra UI. See TextSizeInput for style reference.
import React from 'react';
import { Box, Text } from '@chakra-ui/react';
import { Slider } from 'components';


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
    // Chakra UI style, see TextSizeInput for reference
    return (
        <Box>
            <Text fontSize="sm" color="primary" mb={2}>
                Padding X ({value}rem)
            </Text>
            <Slider
                defaultValue={[value]}
                min={MIN_PADDING_X}
                max={MAX_PADDING_X}
                step={STEP}
                onChange={val => onChange(Array.isArray(val) ? val[0] : val)}
                aria-label={["Padding X"]}
                disabled={disabled}
                colorPalette={"blue"}
            />
        </Box>
    );
}

export default PaddingXInput;

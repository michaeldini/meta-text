// PaddingXInput: Slider input for horizontal padding, using Chakra UI. See TextSizeInput for style reference.
import React from 'react';
import { Box } from '@chakra-ui/react/box';
import { Slider } from '@components/ui/slider';


const MIN_PADDING_X = 1;
const MAX_PADDING_X = 5;
const STEP = 1;


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
            <Slider
                label="Padding X"
                showValue
                defaultValue={[value]}
                min={MIN_PADDING_X}
                max={MAX_PADDING_X}
                step={STEP}
                onValueChange={details => onChange(details.value[0])}
                aria-label={["Padding X"]}
                disabled={disabled}
            />
        </Box>
    );
}

export default PaddingXInput;

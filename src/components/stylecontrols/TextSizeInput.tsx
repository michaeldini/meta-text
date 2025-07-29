
import React from 'react';
import { Box } from '@chakra-ui/react/box';
import { Text } from '@chakra-ui/react/typography';
import { Slider } from 'components';
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

    return (
        <Box>
            <Text fontSize="sm" color="fg" mb={2}>
                Text Size ({value}px)
            </Text>
            <Slider
                defaultValue={[value]}
                min={MIN_SIZE}
                max={MAX_SIZE}
                step={STEP}
                onValueChange={details => onChange(details.value[0])}
                aria-label={["Text Size"]}
                disabled={disabled}
                colorPalette={"blue"} // TODO: Use theme color
            />
        </Box>
    );
}

export default TextSizeInput;

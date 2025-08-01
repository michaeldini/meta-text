// LineHeightInput: Slider input for line height, using Chakra UI. See TextSizeInput for style reference.
import React from 'react';
import { Slider } from '@components/ui/slider';

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
        <Slider
            label="Line Height"
            showValue
            defaultValue={[value]}
            min={MIN_LINE_HEIGHT}
            max={MAX_LINE_HEIGHT}
            step={STEP}
            onValueChange={details => onChange(details.value[0])}
            aria-label={["Line Height"]}
            disabled={disabled}
        />
    );
}

export default LineHeightInput;

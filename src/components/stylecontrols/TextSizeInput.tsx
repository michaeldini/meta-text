
import React from 'react';
import { Slider } from '@components/ui/slider';
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
        <Slider
            label="Text Size"
            showValue
            defaultValue={[value]}
            min={MIN_SIZE}
            max={MAX_SIZE}
            step={STEP}
            onValueChange={details => onChange(details.value[0])}
            aria-label={["Text Size"]}
            disabled={disabled}
        />
    );
}

export default TextSizeInput;

import React from 'react';
import { Select } from '@components/ui/select';
import { useFontFamilySelect } from '@hooks/stylecontrols/useFontFamilySelect';


interface FontFamilySelectProps {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
}

export function FontFamilySelect(props: FontFamilySelectProps) {
    const { value, onChange, disabled } = props;
    const { fontFamilyOptions } = useFontFamilySelect({ value, onChange });
    return (
        <Select
            options={fontFamilyOptions.items}
            value={value}
            onChange={onChange}
            placeholder="Font"
            disabled={disabled}
            width="200px"
            label="Font"
        />
    );
}

export default FontFamilySelect;
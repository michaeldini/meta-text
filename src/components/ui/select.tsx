/**
 * Unified Select component for the app.
 * Replaced Chakra implementation with a lightweight, accessible native <select>
 * styled using Stitches. Preserves the public API used across the app.
 */
import React from 'react';
import { Box, Text, SelectEl } from '@styles';

export interface SelectOption {
    label: string;
    value: string;
    /* eslint-disable */
    [key: string]: any;
}

export interface SelectProps {
    options: SelectOption[];
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    label?: string;
}


export const Select: React.FC<SelectProps> = ({
    options,
    value = '',
    onChange,
    placeholder = 'Select an option',
    disabled = false,
    label,
}) => {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onChange?.(e.target.value);
    };

    return (
        <Box padding="none">
            {label && <Text css={{ marginBottom: '.25rem' }}>{label}</Text>}
            <SelectEl value={value ?? ''} onChange={handleChange} disabled={disabled} aria-label={label ?? placeholder}>
                {placeholder && (
                    <option value="" disabled={true} hidden={false}>
                        {placeholder}
                    </option>
                )}
                {options.map((option) => (
                    <option value={option.value} key={option.value}>
                        {option.label}
                    </option>
                ))}
            </SelectEl>
        </Box>
    );
};

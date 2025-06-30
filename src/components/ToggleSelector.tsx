import React from 'react';
import { ToggleButton, ToggleButtonGroup, Box } from '@mui/material';

export interface ToggleSelectorOption<T extends string> {
    value: T;
    label: string;
    ariaLabel?: string;
}

export interface ToggleSelectorProps<T extends string> {
    value: T;
    options: ToggleSelectorOption<T>[];
    onChange: (value: T) => void;
    disabled?: boolean;
    sx?: object;
}

function ToggleSelector<T extends string>({ value, options, onChange, disabled, sx }: ToggleSelectorProps<T>) {
    const handleChange = (_event: React.MouseEvent<HTMLElement>, newValue: T | null) => {
        if (newValue) onChange(newValue);
    };
    return (
        <Box sx={sx}>
            <ToggleButtonGroup
                value={value}
                exclusive
                onChange={handleChange}
                disabled={disabled}
                aria-label="toggle selector"
                sx={{ padding: 1 }}
            >
                {options.map(opt => (
                    <ToggleButton key={opt.value} value={opt.value} aria-label={opt.ariaLabel || opt.label}>
                        {opt.label}
                    </ToggleButton>
                ))}
            </ToggleButtonGroup>
        </Box>
    );
}

export default ToggleSelector;

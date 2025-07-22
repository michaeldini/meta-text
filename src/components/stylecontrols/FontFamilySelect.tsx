import React from 'react';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';


const FONT_FAMILIES = [
    'Inter, sans-serif',
    'Roboto, sans-serif',
    'Arial, sans-serif',
    'Georgia, serif',
    'Times New Roman, Times, serif',
    'Courier New, Courier, monospace',
    'monospace',
    'Funnel Display, sans-serif',
    'Open Sans, sans-serif',
];


interface FontFamilySelectProps {
    value: string;
    onChange: (val: string) => void;
    disabled?: boolean;
}


const FontFamilySelect: React.FC<FontFamilySelectProps> = ({ value, onChange, disabled }) => {
    const handleChange = (event: SelectChangeEvent<string>) => {
        onChange(event.target.value);
    };
    return (
        <FormControl size="small" sx={{ ml: 2 }}>
            <InputLabel id="font-family-label">Font</InputLabel>
            <Select
                labelId="font-family-label"
                value={value}
                label="Font"
                onChange={handleChange}
                disabled={disabled}
            >
                {FONT_FAMILIES.map((font) => (
                    <MenuItem key={font} value={font} style={{ fontFamily: font }}>
                        {font.split(',')[0]}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default FontFamilySelect;

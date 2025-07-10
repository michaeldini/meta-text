import React from 'react';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { useUIPreferencesStore, FONT_FAMILIES } from 'store/uiPreferences';

const FontFamilySelect: React.FC = () => {
    const fontFamily = useUIPreferencesStore(state => state.fontFamily);
    const setFontFamily = useUIPreferencesStore(state => state.setFontFamily);

    const handleChange = (event: SelectChangeEvent<string>) => {
        setFontFamily(event.target.value);
    };

    return (
        <FormControl size="small" sx={{ ml: 2 }}>
            <InputLabel id="font-family-label">Font</InputLabel>
            <Select
                labelId="font-family-label"
                value={fontFamily}
                label="Font"
                onChange={handleChange}
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

import React from 'react';
import { TextField } from '@mui/material';

/**
 * Reusable search bar component for consistent search UI.
 * Props:
 * - label: string (label for the search bar)
 * - value: string (current search value)
 * - onChange: function (called with new value)
 * - sx: style overrides (optional)
 * - other TextField props
 */
export default function SearchBar({ label, value, onChange, sx, ...props }) {
    return (
        <TextField
            label={label}
            variant="outlined"
            fullWidth
            value={value}
            onChange={e => onChange(e.target.value)}
            sx={{
                ...sx,
                '& .MuiInputBase-input': {
                    color: '#fff', // Light text color
                },
            }}
            {...props}
        />
    );
}

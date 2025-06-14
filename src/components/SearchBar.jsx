import React from 'react';
import { Paper, TextField } from '@mui/material';

/**
 * Reusable search bar component for consistent search UI.
 * Props:
 * - label: string (label for the search bar)
 * - value: string (current search value)
 * - onChange: function (called with new value)
 */
export default function SearchBar({ label, value, onChange, }) {
    return (
        <Paper
            elevation={3}
        >
            <TextField
                data-testid="search-bar"
                fullWidth
                label={label}
                value={value}
                onChange={e => onChange(e.target.value)}
            />
        </Paper >
    );
}

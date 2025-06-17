import React from 'react';
import { Paper, TextField } from '@mui/material';

export interface SearchBarProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ label, value, onChange }) => {
    return (
        <Paper elevation={3}>
            <TextField
                data-testid="search-bar"
                fullWidth
                label={label}
                value={value}
                onChange={e => onChange(e.target.value)}
            />
        </Paper>
    );
};

export default SearchBar;

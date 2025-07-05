import React from 'react';
import { TextField, MenuItem } from '@mui/material';

interface StyleOption {
    value: string;
    label: string;
}

interface CompressionStyleSelectProps {
    style: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    options: StyleOption[];
}

const CompressionStyleSelect: React.FC<CompressionStyleSelectProps> = ({ style, onChange, options }) => (
    <TextField
        select
        label="Compression Style"
        value={style}
        onChange={onChange}
        fullWidth
        margin="normal"
    >
        {options.map(opt => (
            <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
        ))}
    </TextField>
);

export default CompressionStyleSelect;

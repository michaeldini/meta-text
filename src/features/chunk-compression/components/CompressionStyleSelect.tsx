import React from 'react';
import { TextField, MenuItem } from '@mui/material';
import type { CompressionStyleSelectProps } from 'features/chunk-shared/types';

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

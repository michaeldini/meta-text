import React from 'react';
import { TextField, MenuItem } from '@mui/material';
import type { RewriteStyleSelectProps } from 'features/chunk-shared/types';

const RewriteStyleSelect: React.FC<RewriteStyleSelectProps> = ({ style, onChange, options }) => (
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

export default RewriteStyleSelect;

import React from 'react';
import { TextField } from '@mui/material';

/**
 * ChunkTextField - reusable for summary/notes fields in Chunk
 * Props:
 *   label, value, onChange, onBlur, sx, minRows, ...rest
 */
const ChunkTextField = ({ label, value, onChange, onBlur, sx, minRows = 2, ...rest }) => (
    <TextField
        label={label}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        multiline
        minRows={minRows}
        variant="outlined"
        fullWidth
        sx={sx}
        {...rest}
    />
);

export default ChunkTextField;

import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';

export interface ChunkTextFieldProps extends Omit<TextFieldProps, 'onChange'> {
    label: string;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
    sx?: object;
    minRows?: number;
}

const ChunkTextField: React.FC<ChunkTextFieldProps> = ({ label, value, onChange, onBlur, sx, minRows = 2, ...rest }) => (
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

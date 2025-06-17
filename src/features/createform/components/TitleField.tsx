import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';

interface TitleFieldProps extends Omit<TextFieldProps, 'label' | 'value' | 'onChange'> {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    loading: boolean;
    label?: string;
}

const TitleField: React.FC<TitleFieldProps> = ({ value, onChange, loading, label = 'Title', ...props }) => (
    <TextField
        label={label}
        type="text"
        value={value}
        onChange={onChange}
        fullWidth
        required
        disabled={loading}
        {...props}
    />
);

export default TitleField;

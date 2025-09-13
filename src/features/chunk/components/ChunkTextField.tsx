import React from 'react';
import { Textarea } from '@styles';

export interface ChunkTextFieldProps {
    label: string;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onBlur?: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
    placeholder?: string;
}


// use shared Textarea from stitches config

export function ChunkTextField({ label, value, onChange, onBlur, placeholder, ...rest }: ChunkTextFieldProps) {
    return (
        <Textarea
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            data-testid={`${label} input field`}
            {...rest}
        />
    );
}
export default ChunkTextField;
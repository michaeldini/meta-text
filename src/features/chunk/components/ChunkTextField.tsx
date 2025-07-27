import React from 'react';
import { Textarea } from '@chakra-ui/react';

export interface ChunkTextFieldProps {
    label: string;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onBlur?: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
    placeholder?: string;
    minRows?: number;
}


export function ChunkTextField({ label, value, onChange, onBlur, placeholder, minRows = 2, ...rest }: ChunkTextFieldProps) {
    return (
        <Textarea
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            // minRows={minRows}
            {...rest}
            data-testid={`${label} input field`}
        />
    );
}
export default ChunkTextField;
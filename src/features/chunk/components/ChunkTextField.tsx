import React from 'react';
import { Textarea } from '@chakra-ui/react/textarea';

export interface ChunkTextFieldProps {
    label: string;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onBlur?: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
    placeholder?: string;
}


export function ChunkTextField({ label, value, onChange, onBlur, placeholder, ...rest }: ChunkTextFieldProps) {
    return (
        <Textarea
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            data-testid={`${label} input field`}
            variant="subtle"
            size="lg"
            resize="none"
            autoresize
            {...rest}
        />
    );
}
export default ChunkTextField;
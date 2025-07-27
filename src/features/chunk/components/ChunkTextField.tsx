import React from 'react';
import { Textarea } from '@chakra-ui/react';

export interface ChunkTextFieldProps {
    label: string;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onBlur?: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
    sx?: object;
    minRows?: number;
}


export function ChunkTextField({ label, value, onChange, onBlur, sx, minRows = 2, ...rest }: ChunkTextFieldProps) {
    return (
        <Textarea
            // label={label}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            // minRows={minRows}
            {...rest}
            data-testid={`${label} input field`}
        />
    );
}
export default ChunkTextField;
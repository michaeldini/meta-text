import React from 'react';
import { styled } from '@styles';

export interface ChunkTextFieldProps {
    label: string;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onBlur?: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
    placeholder?: string;
}


const StyledTextarea = styled('textarea', {
    width: '100%',
    minHeight: '60px',
    padding: '8px 6px',
    border: 'none',
    borderBottom: '1px solid $colors$gray400',
    outline: 'none',
    fontSize: '0.95rem',
    background: 'transparent',
    color: 'inherit',
    resize: 'none',
    '::placeholder': { color: '$colors$gray500' },
});

export function ChunkTextField({ label, value, onChange, onBlur, placeholder, ...rest }: ChunkTextFieldProps) {
    return (
        <StyledTextarea
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
/**
 * Unified Select component for the app.
 * Replaced Chakra implementation with a lightweight, accessible native <select>
 * styled using Stitches. Preserves the public API used across the app.
 */
import React from 'react';
import { styled } from '@styles';

export interface SelectOption {
    label: string;
    value: string;
    /* eslint-disable */
    [key: string]: any;
}

export interface SelectProps {
    options: SelectOption[];
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    label?: string;
    width?: string | number;
}

const Label = styled('label', {
    display: 'block',
    fontSize: '0.85rem',
    fontFamily: '$fonts$body',
    color: '$colors$tooltipText',
    marginBottom: 6,
});

const SelectEl = styled('select', {
    color: '$colors$text',
    maxWidth: '320px',
    appearance: 'none',
    WebkitAppearance: 'none',
    MozAppearance: 'none',
    padding: '8px 36px 8px 10px',
    borderRadius: 6,
    border: '1px solid $colors$border',
    background: 'transparent',
    fontSize: '1rem',
    fontFamily: '$fonts$body',
    lineHeight: '1.2',
    backgroundImage: 'linear-gradient(45deg, transparent 50%, currentColor 50%), linear-gradient(135deg, currentColor 50%, transparent 50%)',
    backgroundPosition: 'calc(100% - 18px) calc(1em + 2px), calc(100% - 13px) calc(1em + 2px)',
    backgroundSize: '5px 5px, 5px 5px',
    backgroundRepeat: 'no-repeat',
    '&:disabled': {
        opacity: 0.6,
        cursor: 'not-allowed',
    },
});

export const Select: React.FC<SelectProps> = ({
    options,
    value = '',
    onChange,
    placeholder = 'Select an option',
    disabled = false,
    label,
    width = '100%',
}) => {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onChange?.(e.target.value);
    };

    const styleWidth = typeof width === 'number' ? `${width}px` : width;

    return (
        <div style={{ width: styleWidth }}>
            {label && <Label>{label}</Label>}
            <SelectEl value={value ?? ''} onChange={handleChange} disabled={disabled} aria-label={label ?? placeholder}>
                {placeholder && (
                    <option value="" disabled={true} hidden={false}>
                        {placeholder}
                    </option>
                )}
                {options.map((option) => (
                    <option value={option.value} key={option.value}>
                        {option.label}
                    </option>
                ))}
            </SelectEl>
        </div>
    );
};

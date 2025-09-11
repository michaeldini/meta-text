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
    size?: 'xs' | 'sm' | 'md' | 'lg';
    variant?: 'outline' | 'subtle';
    width?: string | number;
    disablePortal?: boolean; // kept for compatibility but ignored for native select
}

const Label = styled('label', {
    display: 'block',
    fontSize: '0.85rem',
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
    border: '1px solid $colors$gray400',
    background: 'transparent',
    fontSize: '1rem',
    lineHeight: '1.2',
    backgroundImage: 'linear-gradient(45deg, transparent 50%, currentColor 50%), linear-gradient(135deg, currentColor 50%, transparent 50%)',
    backgroundPosition: 'calc(100% - 18px) calc(1em + 2px), calc(100% - 13px) calc(1em + 2px)',
    backgroundSize: '5px 5px, 5px 5px',
    backgroundRepeat: 'no-repeat',
    '&:disabled': {
        opacity: 0.6,
        cursor: 'not-allowed',
    },
    variants: {
        size: {
            xs: { padding: '4px 30px 4px 8px', fontSize: '0.8rem' },
            sm: { padding: '6px 32px 6px 8px', fontSize: '0.9rem' },
            md: { padding: '8px 36px 8px 10px', fontSize: '1rem' },
            lg: { padding: '10px 40px 10px 12px', fontSize: '1.05rem' },
        },
        variant: {
            outline: {},
            subtle: { borderColor: '$colors$gray500', background: '$colors$gray400' },
        },
    },
    defaultVariants: {
        size: 'md',
        variant: 'outline',
    },
});

export const Select: React.FC<SelectProps> = ({
    options,
    value = '',
    onChange,
    placeholder = 'Select an option',
    disabled = false,
    label,
    size = 'md',
    variant = 'outline',
    width = '100%',
}) => {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onChange?.(e.target.value);
    };

    const styleWidth = typeof width === 'number' ? `${width}px` : width;

    return (
        <div style={{ width: styleWidth }}>
            {label && <Label>{label}</Label>}
            <SelectEl value={value ?? ''} onChange={handleChange} disabled={disabled} size={size} variant={variant} aria-label={label ?? placeholder}>
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

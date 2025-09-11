
/**
 * useFontFamilySelect - Hook for FontFamilySelect presentational logic
 * Handles font family options and change handler for FontFamilySelect component.
 */
import React from 'react';
// Custom function to build font family options for FontFamilySelect

const FONT_FAMILIES = [
    'Inter, sans-serif',
    'Roboto, sans-serif',
    'Arial, sans-serif',
    'Georgia, serif',
    'Times New Roman, Times, serif',
    'Courier New, Courier, monospace',
    'monospace',
    'Funnel Display, sans-serif',
    'Open Sans, sans-serif',
];

interface UseFontFamilySelectProps {
    value: string;
    onChange: (val: string) => void;
}

export function useFontFamilySelect({ value, onChange }: UseFontFamilySelectProps) {
    const handleChange = (event: React.FormEvent<HTMLDivElement>) => {
        // The Select.Root component provides a FormEvent whose target may not
        // be a native input. Coerce carefully and fallback to the current
        // value if extraction fails.
        const target = event.target as unknown as { value?: string } | null;
        const val = target && typeof target.value === 'string' ? target.value : value;
        onChange(val);
    };
    // Ensure 'value' is referenced to avoid unused var lint
    const _currentValue = value;
    const fontFamilyOptions = {
        items: FONT_FAMILIES.map(font => ({
            value: font,
            label: font.split(',')[0],
            style: { fontFamily: font }
        })),
        itemToString: (item: { label?: string }) => item?.label ?? '',
    };
    return {
        fontFamilyOptions,
        handleChange,
    };
}

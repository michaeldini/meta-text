
/**
 * useFontFamilySelect - Hook for FontFamilySelect presentational logic
 * Handles font family options and change handler for FontFamilySelect component.
 */
import { createListCollection } from '@chakra-ui/react/collection';

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
    const handleChange = (event: any) => {
        onChange(event.target.value);
    };
    const fontFamilyOptions = createListCollection({
        items: FONT_FAMILIES.map(font => ({
            value: font,
            label: font.split(',')[0],
            style: { fontFamily: font }
        }))
    });
    return {
        fontFamilyOptions,
        handleChange,
    };
}

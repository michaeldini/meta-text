import React from 'react';

import { createListCollection, Select, Portal, } from '@chakra-ui/react';

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


interface FontFamilySelectProps {
    value: string;
    onChange: (val: string) => void;
    disabled?: boolean;
}

export function FontFamilySelect(props: FontFamilySelectProps): React.ReactElement {

    const { value, onChange, disabled = false } = props;

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
    return (
        <form>
            <Select.Root width="200px" collection={fontFamilyOptions} onChange={handleChange} >
                <Select.HiddenSelect />
                <Select.Label color="primary">Font</Select.Label>
                <Select.Control>
                    <Select.Trigger>
                        <Select.ValueText placeholder="Font" />
                    </Select.Trigger>
                    <Select.IndicatorGroup>
                        <Select.Indicator />
                    </Select.IndicatorGroup>
                </Select.Control>
                <Portal >
                    <Select.Positioner>
                        <Select.Content>
                            {fontFamilyOptions.items.map((framework) => (
                                <Select.Item item={framework} key={framework.value}>
                                    {framework.label}
                                    <Select.ItemIndicator />
                                </Select.Item>
                            ))}
                        </Select.Content>
                    </Select.Positioner>
                </Portal>
            </Select.Root>
        </form>
    );
}

export default FontFamilySelect;

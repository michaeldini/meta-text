import React from 'react';
import { Select } from '@chakra-ui/react/select';
import { Portal } from '@chakra-ui/react/portal';
import { useFontFamilySelect } from '../../hooks/stylecontrols/useFontFamilySelect';


interface FontFamilySelectProps {
    value: string;
    onChange: (val: string) => void;
    disabled?: boolean;
}
export function FontFamilySelect(props: FontFamilySelectProps) {
    const { value, onChange, disabled = false } = props;
    const { fontFamilyOptions, handleChange } = useFontFamilySelect({ value, onChange });
    return (
        <form>
            <Select.Root width="200px" collection={fontFamilyOptions} onChange={handleChange} >
                <Select.HiddenSelect />
                <Select.Label color="fg">Font</Select.Label>
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
// RewriteSelect: Dropdown for selecting a rewrite option using Chakra UI v3 Select
import React from 'react';
import { Portal, Select, createListCollection } from '@chakra-ui/react';
import type { RewriteSelectProps } from 'features/chunk-shared/types';



export function RewriteSelect({ rewrites, selectedId, setSelectedId }: RewriteSelectProps) {
    // Convert rewrites to Chakra UI Select collection format
    const rewriteCollection = createListCollection({
        items: rewrites.map(r => ({ label: r.title, value: String(r.id), id: r.id }))
    });

    return (
        <Select.Root
            collection={rewriteCollection}
            value={[String(selectedId)]}
            onValueChange={details => {
                if (details.value && details.value.length > 0) {
                    setSelectedId(Number(details.value[0]));
                }
            }}
            size="sm"
            width="320px"
        >
            <Select.HiddenSelect />
            <Select.Label>Rewrite</Select.Label>
            <Select.Control>
                <Select.Trigger>
                    <Select.ValueText placeholder="Select rewrite" />
                </Select.Trigger>
                <Select.IndicatorGroup>
                    <Select.Indicator />
                </Select.IndicatorGroup>
            </Select.Control>
            <Portal>
                <Select.Positioner>
                    <Select.Content>
                        {rewriteCollection.items.map(item => (
                            <Select.Item item={item} key={item.value}>
                                {item.label}
                                <Select.ItemIndicator />
                            </Select.Item>
                        ))}
                    </Select.Content>
                </Select.Positioner>
            </Portal>
        </Select.Root>
    );
}

export default RewriteSelect;
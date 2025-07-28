// Controlled select for rewrite style using Chakra UI v3 Menu
import React from 'react';
import { Button } from '@chakra-ui/react/button';
import { Menu } from '@chakra-ui/react/menu';

// Props and option type for RewriteStyleSelect (local, not shared)
export interface StyleOption {
    value: string;
    label: string;
}

export interface RewriteStyleSelectProps {
    style: string;
    onChange: (value: string) => void;
    options: StyleOption[];
}

export function RewriteStyleSelect({ style, onChange, options }: RewriteStyleSelectProps) {
    return (
        <Menu.Root>
            <Menu.Trigger asChild>
                <Button variant="outline" w="full">
                    {options.find(opt => opt.value === style)?.label || 'Select style'}
                </Button>
            </Menu.Trigger>
            <Menu.Positioner>
                <Menu.Content minW="xs">
                    <Menu.RadioItemGroup
                        value={style}
                        onValueChange={details => onChange(details.value)}
                    >
                        {options.map(opt => (
                            <Menu.RadioItem key={opt.value} value={opt.value}>
                                {opt.label}
                                <Menu.ItemIndicator />
                            </Menu.RadioItem>
                        ))}
                    </Menu.RadioItemGroup>
                </Menu.Content>
            </Menu.Positioner>
        </Menu.Root>
    );
}
export default RewriteStyleSelect;

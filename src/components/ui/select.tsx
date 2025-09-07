/**
 * Unified Select component for the app.
 * Wraps Chakra UI Select for consistent, maintainable dropdowns.
 * Supports basic usage: options, value, onChange, placeholder, disabled.
 * Advanced features (grouping, custom rendering) can be added as needed.
 */
import React from "react";
import {
    Select as ChakraSelect,
    Portal,
    createListCollection,
} from "@chakra-ui/react";

export interface SelectOption {
    label: string;
    value: string;
    [key: string]: any;
}

export interface SelectProps {
    options: SelectOption[];
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    label?: string;
    size?: "xs" | "sm" | "md" | "lg";
    variant?: "outline" | "subtle";
    width?: string | number;
    disablePortal?: boolean;
}

export const Select: React.FC<SelectProps> = ({
    options,
    value,
    onChange,
    placeholder = "Select an option",
    disabled = false,
    label,
    size = "md",
    variant = "outline",
    width = "100%",
    disablePortal = false,
}) => {
    const collection = createListCollection({ items: options });
    return (
        <ChakraSelect.Root
            collection={collection}
            value={value ? [value] : []}
            onValueChange={(e) => onChange?.(e.value[0])}
            disabled={disabled}
            size={size}
            variant={variant}
            width={width}
        >
            <ChakraSelect.HiddenSelect />
            {label && <ChakraSelect.Label color="fg.muted">{label}</ChakraSelect.Label>}
            <ChakraSelect.Control>
                <ChakraSelect.Trigger>
                    <ChakraSelect.ValueText placeholder={placeholder} />
                </ChakraSelect.Trigger>
                <ChakraSelect.IndicatorGroup>
                    <ChakraSelect.Indicator />
                </ChakraSelect.IndicatorGroup>
            </ChakraSelect.Control>
            {disablePortal ? (
                <ChakraSelect.Positioner>
                    <ChakraSelect.Content>
                        {options.map((option) => (
                            <ChakraSelect.Item item={option} key={option.value}>
                                {option.label}
                                <ChakraSelect.ItemIndicator />
                            </ChakraSelect.Item>
                        ))}
                    </ChakraSelect.Content>
                </ChakraSelect.Positioner>
            ) : (
                <Portal>
                    <ChakraSelect.Positioner>
                        <ChakraSelect.Content>
                            {options.map((option) => (
                                <ChakraSelect.Item item={option} key={option.value}>
                                    {option.label}
                                    <ChakraSelect.ItemIndicator />
                                </ChakraSelect.Item>
                            ))}
                        </ChakraSelect.Content>
                    </ChakraSelect.Positioner>
                </Portal>
            )}
        </ChakraSelect.Root>
    );
};

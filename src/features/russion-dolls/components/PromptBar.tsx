// Purpose: Reusable prompt input with submit button. Emits onSubmit with the typed value.

import React from 'react';
import { Box, Button, Flex, Input, Spinner, Text } from '@chakra-ui/react';

export type PromptBarProps = {
    value: string;
    onChange: (v: string) => void;
    onSubmit: (value: string) => Promise<void> | void;
    loading?: boolean;
    error?: string | null;
};

export function PromptBar({ value, onChange, onSubmit, loading, error }: PromptBarProps) {
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = value.trim();
        if (!trimmed) return;
        await onSubmit(trimmed);
    };

    return (
        <Box as="form" onSubmit={handleSubmit} w="100%" maxW="960px" mx="auto">
            <Flex gap={2} align="center" borderBottom="1px solid" borderColor="gray.200">
                <Input
                    placeholder="Enter your prompt..."
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    disabled={!!loading}
                />
                <Button type="submit" colorScheme="blue" disabled={!value.trim() || !!loading}>
                    {loading ? <Spinner size="sm" /> : 'Send'}
                </Button>
            </Flex>
            {error && (
                <Text mt={2} color="red.400" fontSize="sm">{error}</Text>
            )}
        </Box>
    );
};

export default PromptBar;

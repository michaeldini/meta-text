// Purpose: Reusable prompt input with submit button. Emits onSubmit with the typed value.

import React from 'react';
import { Box, Button, Stack, Flex, Input as StInput, Text, Spinner } from '@styles';

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
        <Box as="form" onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 960, marginInline: 'auto' }}>
            <Flex>
                <StInput
                    placeholder="Enter your prompt..."
                    value={value}
                    onChange={e => onChange((e.target as HTMLInputElement).value)}
                    disabled={!!loading}
                />
                <Button type="submit" disabled={!value.trim() || !!loading}>
                    {loading ? <Spinner /> : 'Send'}
                </Button>
            </Flex>
            {error && (
                <Text css={{ marginTop: 8, fontSize: '0.9rem' }}>{error}</Text>
            )}
        </Box>
    );
};

export default PromptBar;

/**
 * RewriteGenerationDialog
 * Drawer-based dialog mirroring ImageGenerationDialog pattern.
 */
import React from 'react';
import { Drawer } from '@chakra-ui/react/drawer';
import { Button, CloseButton } from '@chakra-ui/react/button';
import { Box } from '@chakra-ui/react/box';
import { Text } from '@chakra-ui/react/text';
import { Stack } from '@chakra-ui/react/stack';
import { Portal } from '@chakra-ui/react/portal';

export interface RewriteGenerationDialogProps {
    open: boolean;
    onClose: () => void;
    styleValue: string;
    onStyleChange: (val: string) => void;
    loading: boolean;
    error: string | null;
    onSubmit: () => Promise<void> | void;
}

const STYLE_OPTIONS = [
    { value: 'like im 5', label: 'Like I’m 5' },
    { value: 'like a bro', label: 'Like a Bro' },
    { value: 'academic', label: 'Academic' }
];

export function RewriteGenerationDialog({ open, onClose, styleValue, onStyleChange, loading, error, onSubmit }: RewriteGenerationDialogProps) {
    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => onStyleChange(e.target.value);
    const handleFormSubmit = async (e: React.FormEvent) => { e.preventDefault(); await onSubmit(); };

    return (
        <Drawer.Root open={open} onOpenChange={() => onClose()}>
            <Portal>
                <Drawer.Backdrop />
                <Drawer.Positioner>
                    <Drawer.Content maxW="sm" w="full">
                        <Drawer.Header>
                            <Drawer.Title>Generate Rewrite</Drawer.Title>
                        </Drawer.Header>
                        <form onSubmit={handleFormSubmit}>
                            <Drawer.Body>
                                <Stack gap={4}>
                                    <Box>
                                        <label htmlFor="rewrite-style">Rewrite style:</label>
                                        <select
                                            id="rewrite-style"
                                            value={styleValue}
                                            onChange={handleSelectChange}
                                            style={{ width: '100%', marginTop: 8 }}
                                            disabled={loading}
                                        >
                                            {STYLE_OPTIONS.map(opt => (
                                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                                            ))}
                                        </select>
                                    </Box>
                                    {error && <Text color="red.500">{error}</Text>}
                                </Stack>
                            </Drawer.Body>
                            <Drawer.Footer>
                                <Button type="button" onClick={onClose} disabled={loading} variant="ghost">Cancel</Button>
                                <Button type="submit" disabled={loading} loading={loading}>Generate & Save</Button>
                                <Drawer.CloseTrigger asChild>
                                    <CloseButton />
                                </Drawer.CloseTrigger>
                            </Drawer.Footer>
                        </form>
                    </Drawer.Content>
                </Drawer.Positioner>
            </Portal>
        </Drawer.Root>
    );
}

export default RewriteGenerationDialog;

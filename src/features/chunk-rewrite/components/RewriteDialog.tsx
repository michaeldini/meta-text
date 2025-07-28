// Dialog for rewriting a chunk, using Chakra UI v3 Dialog API
import React from 'react';
import { Button, CloseButton } from '@chakra-ui/react/button';
import { Text } from '@chakra-ui/react/typography';
import { Drawer } from '@chakra-ui/react/drawer';
import { Portal } from '@chakra-ui/react/portal';
import RewriteStyleSelect from './RewriteStyleSelect';


// Props and option type for RewriteDialog (local, not shared)
export interface StyleOption {
    value: string;
    label: string;
}

export interface RewriteDialogProps {
    open: boolean;
    onClose: () => void;
    style: string;
    onStyleChange: (value: string) => void;
    options: StyleOption[];
    loading?: boolean;
    error?: string | null;
    onSave: () => void;
    saving?: boolean;
    canSave?: boolean;
}

// Drawer for rewriting a chunk, using Chakra UI v3 Drawer API
export function RewriteDialog({ open, onClose, style, onStyleChange, options, loading, error, onSave, saving, canSave }: Pick<RewriteDialogProps, 'open' | 'onClose' | 'style' | 'onStyleChange' | 'options' | 'loading' | 'error' | 'onSave' | 'saving' | 'canSave'>) {

    return (
        <Drawer.Root open={open} onOpenChange={e => { if (!e.open) onClose(); }}>
            <Portal>
                <Drawer.Backdrop />
                <Drawer.Positioner>
                    <Drawer.Content maxW="sm" w="full">
                        <Drawer.Header>
                            <Drawer.Title>Rewrite Chunk</Drawer.Title>
                        </Drawer.Header>
                        <Drawer.Body>
                            {/* Compression style selection component */}
                            <RewriteStyleSelect
                                style={style}
                                onChange={onStyleChange}
                                options={options}
                            />
                            {/* Error message display */}
                            {error && <Text color="red.500" mt={2}>{error}</Text>}
                        </Drawer.Body>
                        <Drawer.Footer>
                            <Drawer.ActionTrigger asChild>
                                <Button variant="outline" onClick={onClose} disabled={saving}>Cancel</Button>
                            </Drawer.ActionTrigger>
                            <Button onClick={onSave} disabled={!canSave || saving} colorScheme="blue" loading={saving} >
                                'Generate & Save'
                            </Button>
                        </Drawer.Footer>
                        <Drawer.CloseTrigger asChild>
                            <CloseButton size="sm" />
                        </Drawer.CloseTrigger>
                    </Drawer.Content>
                </Drawer.Positioner>
            </Portal>
        </Drawer.Root>
    );
}

// ...existing code...
export default RewriteDialog;
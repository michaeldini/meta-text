// Dialog for rewriting a chunk, using Chakra UI v3 Dialog API
import React from 'react';
import { Button, CloseButton, Dialog, Portal, Text } from '@chakra-ui/react';
import RewriteStyleSelect from './RewriteStyleSelect';
import { LoadingSpinner } from 'components';
import type { RewriteDialogProps } from 'features/chunk-shared/types';

export function RewriteDialog({ open, onClose, style, onStyleChange, options, loading, error, onSave, saving, canSave }: Pick<RewriteDialogProps, 'open' | 'onClose' | 'style' | 'onStyleChange' | 'options' | 'loading' | 'error' | 'onSave' | 'saving' | 'canSave'>) {
    return (
        <Dialog.Root lazyMount open={open} onOpenChange={e => { if (!e.open) onClose(); }}>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content maxW="sm" w="full">
                        <Dialog.Header>
                            <Dialog.Title>Rewrite Chunk</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body>
                            {/* Compression style selection component */}
                            <RewriteStyleSelect
                                style={style}
                                onChange={onStyleChange}
                                options={options}
                            />
                            {/* Error message display */}
                            {error && <Text color="red.500" mt={2}>{error}</Text>}
                        </Dialog.Body>
                        <Dialog.Footer>
                            <Dialog.ActionTrigger asChild>
                                <Button variant="outline" onClick={onClose} disabled={saving}>Cancel</Button>
                            </Dialog.ActionTrigger>
                            <Button onClick={onSave} disabled={!canSave || saving} colorScheme="blue">
                                {saving ? <LoadingSpinner /> : 'Generate & Save'}
                            </Button>
                        </Dialog.Footer>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton size="sm" />
                        </Dialog.CloseTrigger>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
}

export default RewriteDialog;
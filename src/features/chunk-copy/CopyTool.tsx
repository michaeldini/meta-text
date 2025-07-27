import React from 'react';
import { Box, IconButton, Tooltip, Text, Clipboard } from '@chakra-ui/react';
import { useNotifications } from 'store';
import type { CopyToolProps } from 'features/chunk-shared/types';


export function CopyTool({ chunkText, 'data-testid': dataTestId = 'copy-tool', sx = {} }: CopyToolProps) {
    const { showSuccess, showError } = useNotifications();
    // Chakra UI Clipboard copy button implementation
    // Shows notification on copy success/failure
    // Purpose: Copy chunkText to clipboard using Chakra UI
    // chunkText is formatted before copying
    const formattedChunk = chunkText ? chunkText.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim() : '';

    // Chakra UI Clipboard API
    // See: https://chakra-ui.com/docs/components/clipboard
    // Clipboard.Root, Clipboard.Trigger, Clipboard.Indicator
    // IconButton variant 'surface', size 'xs'
    // Show notification on copy
    return (
        <Box>
            <Clipboard.Root value={formattedChunk} onCopy={() => showSuccess('Chunk copied to clipboard!', 3000)} onError={() => showError('Failed to copy chunk to clipboard.')}
                // isDisabled={!chunkText}
                data-testid={dataTestId}
            >
                <Clipboard.Trigger asChild>
                    <IconButton variant="surface" size="xs">
                        <Clipboard.Indicator />
                    </IconButton>
                </Clipboard.Trigger>
            </Clipboard.Root>
        </Box>
    );
}

export default CopyTool;

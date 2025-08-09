/**
 * IconButton to copy chunk text to clipboard
 * 
 * Chakra UI Clipboard copy button implementation
 * Shows notification on copy success/failure
 * chunkText is formatted before copying
 * Chakra UI Clipboard API: https://chakra-ui.com/docs/components/clipboard
 * Clipboard.Root, Clipboard.Trigger, Clipboard.Indicator
 */

import React from 'react';
import { Box, IconButton, Clipboard } from '@chakra-ui/react';
import { useNotifications } from '@store/notificationStore';


interface CopyToolProps {
    chunkText: string;
}

export function CopyTool({ chunkText }: CopyToolProps) {
    const { showSuccess, showError } = useNotifications();
    const formattedChunk = chunkText ? chunkText.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim() : '';

    return (
        <Box>
            <Clipboard.Root
                value={formattedChunk}
                onCopy={() => showSuccess('Chunk copied to clipboard!', 3000)}
                onError={() => showError('Failed to copy chunk to clipboard.')}
                data-testid='copy-tool'
            >
                <Clipboard.Trigger asChild>
                    <IconButton variant="ghost" color="fg">
                        <Clipboard.Indicator />
                    </IconButton>
                </Clipboard.Trigger>
            </Clipboard.Root>
        </Box>
    );
}

export default CopyTool;

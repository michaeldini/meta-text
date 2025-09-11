/**
 * IconButton to copy chunk text to clipboard
 */
import React, { useState } from 'react';
import { Box } from '@styles';
import TooltipButton from '@components/TooltipButton';
import { useNotifications } from '@store/notificationStore';
import { HiOutlineClipboard, HiClipboard } from 'react-icons/hi2';


interface CopyToolProps {
    chunkText: string;
}

export function CopyTool({ chunkText }: CopyToolProps) {
    const { showSuccess } = useNotifications();
    const formattedChunk = chunkText ? chunkText.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim() : '';
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(formattedChunk);
            setCopied(true);
            showSuccess('Chunk copied to clipboard!', 3000);
            setTimeout(() => setCopied(false), 1200);
        } catch {
            setCopied(false);
        }
    };

    return (
        <Box data-testid='copy-tool'>
            <TooltipButton
                label=""
                tooltip={copied ? 'Copied!' : 'Copy chunk text'}
                icon={copied ? <HiClipboard style={{ fontSize: '1.25rem' }} /> : <HiOutlineClipboard style={{ fontSize: '1.25rem' }} />}
                onClick={handleCopy}
                size="sm"
                tone={copied ? 'primary' : 'default'}
                aria-label="Copy chunk text"
            />
        </Box>
    );
}

export default CopyTool;

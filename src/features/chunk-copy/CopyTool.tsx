/**
 * IconButton to copy chunk text to clipboard
 */
import React, { useState } from 'react';
import { Button, Tooltip } from '@components';
import { HiOutlineClipboard, HiClipboard } from 'react-icons/hi2';


interface CopyToolProps {
    chunkText: string;
}

export function CopyTool({ chunkText }: CopyToolProps) {
    const formattedChunk = chunkText ? chunkText.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim() : '';
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(formattedChunk);
            setCopied(true);
            setTimeout(() => setCopied(false), 1200);
        } catch {
            setCopied(false);
        }
    };

    return (
        <Tooltip content={copied ? 'Copied!' : 'Copy chunk text'}>
            <Button
                icon={copied ? <HiClipboard /> : <HiOutlineClipboard />}
                onClick={handleCopy}
                tone={copied ? 'primary' : 'default'}
                aria-label="Copy chunk text"
            />
        </Tooltip>
    );
}

export default CopyTool;

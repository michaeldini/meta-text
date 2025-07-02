import React from 'react';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import { useChunkStore, useNotifications } from 'store';
import { CopyIcon } from 'icons';

interface CopyToolProps {
    /** Additional CSS class name */
    className?: string;
    /** Test ID for testing */
    'data-testid'?: string;
}

const CopyTool: React.FC<CopyToolProps> = ({
    'data-testid': dataTestId = 'copy-tool'
}) => {
    const activeChunkId = useChunkStore(state => state.activeChunkId);
    const chunkText = useChunkStore(state => {
        const chunk = state.chunks.find(c => c.id === activeChunkId);
        return chunk ? chunk.text : '';
    });
    const { showSuccess, showError } = useNotifications();

    const handleCopyChunk = async () => {
        if (!chunkText) return;
        const formattedChunk = chunkText.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
        try {
            await navigator.clipboard.writeText(formattedChunk);
            showSuccess('Chunk copied to clipboard!', 3000);
        } catch (error) {
            showError('Failed to copy chunk to clipboard.');
        }
    };

    return (
        <>
            <Box>
                <Tooltip
                    title={<Typography variant="caption">Copy the active chunk</Typography>}
                    arrow
                    enterDelay={200}
                    placement='left'
                >
                    <span style={{ display: 'inline-flex' }}>
                        <IconButton
                            onClick={handleCopyChunk}
                            disabled={!activeChunkId}
                            data-testid={dataTestId}
                        >
                            <CopyIcon />
                        </IconButton>
                    </span>
                </Tooltip>
            </Box>
        </>
    );
};

export default CopyTool;

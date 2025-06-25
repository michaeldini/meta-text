import React from 'react';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import { useChunkStore } from '../../../../store/chunkStore';
import { CopyIcon } from '../../../../components/icons';
import { useNotifications } from '../../../../store/notificationStore';

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
            <Box sx={{ width: 40, height: 40, borderRadius: 1, border: '1px solid', }}>
                <Tooltip
                    title={<Typography variant="caption">Copy the active chunk</Typography>}
                    arrow
                    enterDelay={200}
                    placement='left'
                >
                    <IconButton
                        onClick={handleCopyChunk}
                        disabled={!activeChunkId}
                        data-testid={dataTestId}
                    >
                        <CopyIcon style={{ width: 24, height: 24, color: 'currentColor' }} />
                    </IconButton>
                </Tooltip>
            </Box>
        </>
    );
};

export default CopyTool;

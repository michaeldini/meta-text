import React from 'react';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNotifications } from 'store';
import { HiDocumentDuplicate } from 'react-icons/hi2';
import { getSharedToolStyles } from 'features/chunk-shared/styles';
import type { CopyToolProps } from 'features/chunk-shared/types';


export function CopyTool({ chunkText, 'data-testid': dataTestId = 'copy-tool', sx = {} }: CopyToolProps) {
    const { showSuccess, showError } = useNotifications();
    const theme = useTheme();
    const styles = getSharedToolStyles(theme);

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
        <Box sx={sx}>
            <Tooltip
                title={<Typography variant="caption">Copy chunk text</Typography>}
                arrow
                enterDelay={200}
                placement='left'
            >
                <span style={{ display: 'inline-flex' }}>
                    <IconButton
                        onClick={handleCopyChunk}
                        disabled={!chunkText}
                        data-testid={dataTestId}
                        sx={styles.copyToolButton}
                    >
                        <HiDocumentDuplicate />
                    </IconButton>
                </span>
            </Tooltip>
        </Box>
    );
}

export default CopyTool;
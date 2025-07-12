import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';

import { getSharedToolStyles } from 'features/chunk-shared/styles';
import type { ChunkType, UpdateChunkFieldFn } from 'types';
import { useChunkStore } from 'store';
import CompressionTool from './CompressionTool';
import CompressionSelect from './components/CompressionSelect';
import CompressionDisplay from './components/CompressionDisplay';
import CompressionEmptyState from './components/CompressionEmptyState';
import { useCompression } from './hooks/useCompression';
import { LoadingSpinner } from 'components';

interface CompressionDisplayToolProps {
    chunk: ChunkType;
    updateChunkField: UpdateChunkFieldFn;
    isVisible: boolean;
}

const CompressionDisplayTool: React.FC<CompressionDisplayToolProps> = ({
    chunk,
    updateChunkField,
    isVisible
}) => {
    if (!isVisible) return null;
    const theme = useTheme();
    const styles = getSharedToolStyles(theme);
    const { refetchChunk } = useChunkStore();
    const {
        compressions,
        selectedId,
        selected,
        setSelectedId,
        onCompressionCreated
    } = useCompression(chunk);

    // Handle compression creation by refetching only the specific chunk
    const handleCompressionCreated = async () => {
        try {
            await refetchChunk(chunk.id);
        } catch (error) {
            console.error('Failed to refetch chunk after compression creation:', error);
        }
    };

    return (
        <Box sx={styles.toolTabContainer}>
            {compressions.length === 0 ? (
                <CompressionEmptyState chunk={chunk} onCompressionCreated={handleCompressionCreated} />
            ) : (
                <>
                    <Box flexDirection="row" display="flex" alignItems="center">
                        <CompressionTool chunk={chunk} onCompressionCreated={handleCompressionCreated} />
                        <CompressionSelect
                            compressions={compressions}
                            selectedId={selectedId}
                            setSelectedId={setSelectedId}
                            styles={styles}
                        />
                    </Box>
                    <CompressionDisplay selected={selected} styles={styles} />
                </>
            )}
        </Box>
    );
};

export default CompressionDisplayTool;

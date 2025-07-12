import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';

import { getSharedToolStyles } from 'features/chunk-shared/styles';
import type { ChunkType, UpdateChunkFieldFn } from 'types';
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
    const {
        compressions,
        selectedId,
        loading,
        error,
        selected,
        setSelectedId,
        onCompressionCreated
    } = useCompression(chunk);

    return (
        <Box sx={styles.toolTabContainer}>
            {loading ? (
                <LoadingSpinner />
            ) : error ? (
                <Typography color="error">{error}</Typography>
            ) : compressions.length === 0 ? (
                <CompressionEmptyState chunk={chunk} onCompressionCreated={onCompressionCreated} />
            ) : (
                <>
                    <Box flexDirection="row" display="flex" alignItems="center">
                        <CompressionTool chunk={chunk} onCompressionCreated={onCompressionCreated} />
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

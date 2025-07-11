import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';

import { getSharedToolStyles } from '../shared.styles';
import type { CompressionDisplayToolProps } from '../types';
import CompressionToolButton from './CompressionTool';
import CompressionSelect from './components/CompressionSelect';
import CompressionDisplay from './components/CompressionDisplay';
import CompressionEmptyState from './components/CompressionEmptyState';
import { useCompression } from './useCompression';
import { LoadingSpinner } from 'components';

const CompressionDisplayTool: React.FC<CompressionDisplayToolProps> = ({ chunk }) => {
    const theme = useTheme();
    const styles = getSharedToolStyles(theme);
    const {
        compressions,
        selectedId,
        loading,
        error,
        selected,
        setSelectedId,
        fetchCompressions
    } = useCompression(chunk);

    return (
        <Box sx={styles.toolTabContainer}>
            {loading ? (
                <LoadingSpinner />
            ) : error ? (
                <Typography color="error">{error}</Typography>
            ) : compressions.length === 0 ? (
                <CompressionEmptyState chunk={chunk} fetchCompressions={fetchCompressions} />
            ) : (
                <>
                    <Box flexDirection="row" display="flex" alignItems="center">
                        <CompressionToolButton chunk={chunk} onCompressionCreated={fetchCompressions} />
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

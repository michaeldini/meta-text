import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';

import { getSharedToolStyles } from 'features/chunk-shared/styles';
import type { ChunkType, UpdateChunkFieldFn } from 'types';
import { useChunkStore } from 'store';
import RewriteTool from './RewriteTool';
import RewriteSelect from './components/RewriteSelect';
import RewriteDisplay from './components/RewriteDisplay';
import RewriteEmptyState from './components/RewriteEmptyState';
import { useRewrite } from './hooks/useRewrite';
import { LoadingSpinner } from 'components';

interface RewriteDisplayToolProps {
    chunk: ChunkType;
    updateChunkField: UpdateChunkFieldFn;
    isVisible: boolean;
}

export function RewriteDisplayTool(props: RewriteDisplayToolProps) {
    const { chunk, updateChunkField, isVisible } = props;
    if (!isVisible) return null;
    const theme = useTheme();
    const styles = getSharedToolStyles(theme);
    const { refetchChunk } = useChunkStore();
    const {
        rewrites,
        selectedId,
        selected,
        setSelectedId,
        onRewriteCreated: onRewriteCreated
    } = useRewrite(chunk);

    // Handle rewrite creation by refetching only the specific chunk
    const handleRewriteCreated = async () => {
        try {
            await refetchChunk(chunk.id);
        } catch (error) {
            console.error('Failed to refetch chunk after rewrite creation:', error);
        }
    };

    return (
        <Box sx={styles.toolTabContainer}>
            {rewrites.length === 0 ? (
                <RewriteEmptyState chunk={chunk} onRewriteCreated={handleRewriteCreated} />
            ) : (
                <>
                    <Box flexDirection="row" display="flex" alignItems="center">
                        <RewriteTool chunk={chunk} onRewriteCreated={handleRewriteCreated} />
                        <RewriteSelect
                            rewrites={rewrites}
                            selectedId={selectedId}
                            setSelectedId={setSelectedId}
                            styles={styles}
                        />
                    </Box>
                    <RewriteDisplay selected={selected} styles={styles} />
                </>
            )}
        </Box>
    );
};

export default RewriteDisplayTool;

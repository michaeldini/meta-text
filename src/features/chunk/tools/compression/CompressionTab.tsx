import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, useTheme } from '@mui/material';

import { fetchChunkCompressions } from 'services';
import type { ChunkCompression } from 'types';

import CompressionTool from './CompressionTool';
import { getSharedToolStyles } from '../shared.styles';
import { BaseChunkProps } from '../types';
import CompressionSelect from './components/CompressionSelect';
import CompressionDisplay from './components/CompressionDisplay';
import CompressionEmptyState from './components/CompressionEmptyState';

const CompressionTab: React.FC<BaseChunkProps> = ({ chunk }) => {
    const [compressions, setCompressions] = useState<ChunkCompression[]>([]);
    const [selectedId, setSelectedId] = useState<number | ''>('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const theme = useTheme();
    const styles = getSharedToolStyles(theme);

    // Reset state when chunk changes
    useEffect(() => {
        if (!chunk) {
            setCompressions([]);
            setSelectedId('');
            return;
        }
        fetchCompressions();
    }, [chunk]);

    const fetchCompressions = () => {
        setLoading(true);
        setError(null);
        // Set the compression to the database
        // probably rename this because its confusing with the call to OpenAI
        fetchChunkCompressions(chunk.id)
            .then(data => {
                setCompressions(data);
                setSelectedId(data.length > 0 ? data[0].id : '');
            })
            .catch(() => setError('Failed to load compressions.'))
            .finally(() => setLoading(false));
    };

    const selected = compressions.find(c => c.id === selectedId);

    return (
        <Box sx={styles.toolTabContainerWide}>
            {loading ? (
                <CircularProgress />
            ) : error ? (
                <Typography color="error">{error}</Typography>
            ) : compressions.length === 0 ? (
                <CompressionEmptyState chunk={chunk} fetchCompressions={fetchCompressions} />
            ) : (
                <>
                    <Box flexDirection="row" display="flex" alignItems="center" >
                        <CompressionTool chunk={chunk} onCompressionCreated={fetchCompressions} />
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

export default CompressionTab;

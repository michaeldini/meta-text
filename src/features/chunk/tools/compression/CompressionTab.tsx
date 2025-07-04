import React, { useEffect, useState } from 'react';
import { Box, Typography, Select, MenuItem, FormControl, CircularProgress, Paper, useTheme } from '@mui/material';

import { fetchChunkCompressions } from 'services';
import type { ChunkCompression, ChunkType } from 'types';

import CompressionTool from './CompressionTool';
import { getCompressionTabStyles } from './compression.styles';

interface CompressionToolTabProps {
    chunk: ChunkType;
}
const CompressionToolTab: React.FC<CompressionToolTabProps> = ({ chunk }) => {
    const [compressions, setCompressions] = useState<ChunkCompression[]>([]);
    const [selectedId, setSelectedId] = useState<number | ''>('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const theme = useTheme();
    const styles = getCompressionTabStyles(theme);

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
        <Box sx={styles.root}>
            {loading ? (
                <CircularProgress />
            ) : error ? (
                <Typography color="error">{error}</Typography>
            ) : compressions.length === 0 ? (
                <Box>
                    <Typography>No compressions available. Use the Compression Tool below to create a new compression for this chunk.
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                        <CompressionTool chunk={chunk} onCompressionCreated={fetchCompressions} />
                    </Box>
                </Box>
            ) : (
                <>
                    <Box flexDirection="row" display="flex" alignItems="center" >
                        <CompressionTool chunk={chunk} onCompressionCreated={fetchCompressions} />
                        <Typography variant="subtitle1" id="compression-select-label">
                            Compression
                        </Typography>
                        <FormControl sx={styles.form} margin="none">
                            <Select
                                labelId="compression-select-label"
                                value={selectedId}
                                onChange={e => setSelectedId(Number(e.target.value))}
                                aria-labelledby="compression-select-label"
                                sx={styles.select}
                            >
                                {compressions.map(c => (
                                    <MenuItem key={c.id} value={c.id}>{c.title}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                    </Box>
                    {selected && (
                        <Box sx={styles.compressedWords}>
                            <Typography variant="body1">{selected.compressed_text}</Typography>
                        </Box>
                    )}
                </>
            )}
        </Box>
    );
};

export default CompressionToolTab;

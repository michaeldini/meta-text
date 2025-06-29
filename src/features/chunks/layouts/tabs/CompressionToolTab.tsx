import React, { useEffect, useState } from 'react';
import { Box, Typography, Select, MenuItem, FormControl, CircularProgress, Paper, useTheme } from '@mui/material';
import { fetchChunkCompressions } from '../../../../services/chunkService';
import CompressionTool from '../../tools/compression/CompressionTool';
import type { ChunkCompression } from '../../../../types/chunkCompression';
import { getCompressionTabStyles } from '../layouts.styles';

interface CompressionToolTabProps {
    chunk: any;
}
const CompressionToolTab: React.FC<CompressionToolTabProps> = ({ chunk }) => {
    const [compressions, setCompressions] = useState<ChunkCompression[]>([]);
    const [selectedId, setSelectedId] = useState<number | ''>('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const theme = useTheme();
    const styles = getCompressionTabStyles(theme);

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
        <Box sx={{ p: 2, minWidth: '600px', width: '100%' }}>
            {loading ? (
                <CircularProgress />
            ) : error ? (
                <Typography color="error">{error}</Typography>
            ) : compressions.length === 0 ? (
                <Box>
                    <Typography>No compressions available.</Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                        Use the Compression Tool below to create a new compression for this chunk.
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                        <CompressionTool chunk={chunk} onCompressionCreated={fetchCompressions} />
                    </Box>
                </Box>
            ) : (
                <>
                    <Box display="flex" alignItems="center" gap={1}>
                        <Typography variant="subtitle1" sx={{ minWidth: 90, mr: 1 }} id="compression-select-label">
                            Compression
                        </Typography>
                        <FormControl sx={styles.compressionSelectInline} margin="none">
                            <Select
                                labelId="compression-select-label"
                                value={selectedId}
                                onChange={e => setSelectedId(Number(e.target.value))}
                                aria-labelledby="compression-select-label"
                            >
                                {compressions.map(c => (
                                    <MenuItem key={c.id} value={c.id}>{c.title}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <CompressionTool chunk={chunk} onCompressionCreated={fetchCompressions} />
                    </Box>
                    {selected && (
                        <Box sx={styles.compressedWords}>
                            <Typography variant="body2">{selected.compressed_text}</Typography>
                        </Box>
                    )}
                </>
            )}
        </Box>
    );
};

export default CompressionToolTab;

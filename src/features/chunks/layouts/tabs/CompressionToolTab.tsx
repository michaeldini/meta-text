import React, { useEffect, useState } from 'react';
import { Box, Typography, Select, MenuItem, FormControl, InputLabel, CircularProgress, Paper } from '@mui/material';
import { fetchChunkCompressions } from '../../../../services/chunkService';
import CompressionTool from '../../tools/compression/CompressionTool';
import type { ChunkCompression } from '../../../../types/chunkCompression';

interface CompressionToolTabProps {
    chunk: any;
}
const CompressionToolTab: React.FC<CompressionToolTabProps> = ({ chunk }) => {
    const [compressions, setCompressions] = useState<ChunkCompression[]>([]);
    const [selectedId, setSelectedId] = useState<number | ''>('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!chunk) {
            setCompressions([]);
            setSelectedId('');
            return;
        }
        setLoading(true);
        setError(null);
        fetchChunkCompressions(chunk.id)
            .then(data => {
                setCompressions(data);
                setSelectedId(data.length > 0 ? data[0].id : '');
            })
            .catch(() => setError('Failed to load compressions.'))
            .finally(() => setLoading(false));
    }, [chunk]);

    const selected = compressions.find(c => c.id === selectedId);

    return (
        <Box sx={{ p: 2, minWidth: 400, width: '100%' }}>
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
                        <CompressionTool chunk={chunk} />
                    </Box>
                </Box>
            ) : (
                <>
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="compression-select-label">Compression Style</InputLabel>
                        <Select
                            labelId="compression-select-label"
                            value={selectedId}
                            label="Compression Style"
                            onChange={e => setSelectedId(Number(e.target.value))}
                        >
                            {compressions.map(c => (
                                <MenuItem key={c.id} value={c.id}>{c.title}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    {selected && (
                        <Paper elevation={1} sx={{ p: 2, mt: 2, }}>
                            <CompressionTool chunk={chunk} />
                            <Typography variant="subtitle2" gutterBottom>Compressed Text:</Typography>
                            <Typography variant="body1">{selected.compressed_text}</Typography>
                        </Paper>

                    )}
                </>
            )}
        </Box>
    );
};

export default CompressionToolTab;

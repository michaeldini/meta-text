import React, { useEffect, useState } from 'react';
import { Box, Typography, Select, MenuItem, FormControl, InputLabel, CircularProgress, Paper } from '@mui/material';
import { useChunkStore } from '../../../../store/chunkStore';
import { fetchChunkCompressions } from '../../../../services/chunkService';
import CompressionTool from '../../tools/compression/CompressionTool';
import type { ChunkCompression } from '../../../../types/chunkCompression';


const CompressionToolTab: React.FC = () => {
    const activeChunkId = useChunkStore(state => state.activeChunkId);
    const [compressions, setCompressions] = useState<ChunkCompression[]>([]);
    const [selectedId, setSelectedId] = useState<number | ''>('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!activeChunkId) {
            setCompressions([]);
            setSelectedId('');
            return;
        }
        setLoading(true);
        setError(null);
        fetchChunkCompressions(activeChunkId)
            .then(data => {
                setCompressions(data);
                setSelectedId(data.length > 0 ? data[0].id : '');
            })
            .catch(() => setError('Failed to load compressions.'))
            .finally(() => setLoading(false));
    }, [activeChunkId]);

    const selected = compressions.find(c => c.id === selectedId);

    return (
        <Box p={2}>
            <Typography variant="subtitle1" gutterBottom>Available Compressions</Typography>
            <CompressionTool />
            {loading ? (
                <CircularProgress />
            ) : error ? (
                <Typography color="error">{error}</Typography>
            ) : compressions.length === 0 ? (
                <Typography>No compressions available.</Typography>
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
                            <Typography variant="subtitle2" gutterBottom>Compressed Text:</Typography>
                            <Typography variant="body2">{selected.compressed_text}</Typography>
                        </Paper>
                    )}
                </>
            )}
        </Box>
    );
};

export default CompressionToolTab;

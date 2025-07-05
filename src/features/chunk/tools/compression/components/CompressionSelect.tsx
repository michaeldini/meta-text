import React from 'react';
import { FormControl, Select, MenuItem, Typography } from '@mui/material';
import type { ChunkCompression } from 'types';

interface CompressionSelectProps {
    compressions: ChunkCompression[];
    selectedId: number | '';
    setSelectedId: (id: number) => void;
    styles: any;
}

const CompressionSelect: React.FC<CompressionSelectProps> = ({ compressions, selectedId, setSelectedId, styles }) => (
    <>
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
    </>
);

export default CompressionSelect;
